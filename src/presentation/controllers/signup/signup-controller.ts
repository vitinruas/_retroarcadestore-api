import { MissingFieldError } from '../../errors/missing-field-error'
import { InvalidFieldError } from '../../errors/invalid-field-error'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../helpers/http-response-helper'
import { IController } from '../../protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'
import { IEmailValidator } from '../../protocols/email-validator-protocol'
import { IAddAccountUseCase } from '../../../domain/usecases/account/add-account-usecase'

export class SignUpController implements IController {
  constructor(
    private readonly emailValidatorStub: IEmailValidator,
    private readonly addAccountUseCase: IAddAccountUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // check if all required fields has been provided
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ]
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingFieldError(requiredField))
        }
      }

      const { name, email, password } = httpRequest.body

      // check if passwords match
      if (httpRequest.body.password !== httpRequest.body.passwordConfirmation) {
        return badRequest(new InvalidFieldError('passwordConfirmation'))
      }

      const isValid = this.emailValidatorStub.validate(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }

      const accessToken = await this.addAccountUseCase.add({
        name,
        email,
        password
      })

      if (!accessToken) {
        return forbidden('Email already in use')
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError()
    }
  }
}
