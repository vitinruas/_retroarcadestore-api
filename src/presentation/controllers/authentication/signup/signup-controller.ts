import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IEmailValidatorAdapter,
  IAddAccountUseCase
} from './signup-controller-protocols'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../../helpers/http-response-helper'
import { MissingFieldError, InvalidFieldError } from '../../../errors'

export class SignUpController implements IController {
  constructor(
    private readonly emailValidatorStub: IEmailValidatorAdapter,
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

      const { name, email, password, passwordConfirmation } = httpRequest.body

      // check if passwords match
      if (password !== passwordConfirmation) {
        return badRequest(new InvalidFieldError('passwordConfirmation'))
      }

      // check if provided email is valid
      const isValid = this.emailValidatorStub.validate(httpRequest.body.email)

      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }

      // add a new account with the credentials and it should returns an access token
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
