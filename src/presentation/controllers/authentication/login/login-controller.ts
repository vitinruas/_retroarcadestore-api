import { IAuthenticationUseCase } from '../../../../domain/usecases/account/authentication-usecase'
import { InvalidFieldError, MissingFieldError } from '../../../errors'
import { UnauthenticatedLoginError } from '../../../errors/unauthenticated-error'
import {
  badRequest,
  ok,
  serverError,
  unauthorized
} from '../../../helpers/http-response-helper'
import {
  IController,
  IEmailValidatorAdapter,
  IHttpRequest,
  IHttpResponse
} from '../signup/signup-controller-protocols'

export class LoginController implements IController {
  constructor(
    private readonly emailValidator: IEmailValidatorAdapter,
    private readonly authentication: IAuthenticationUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // check if all required fields has been provided
      const requiredFields = ['email', 'password']
      for (const requiredField of requiredFields) {
        if (!httpRequest.body[requiredField]) {
          return badRequest(new MissingFieldError(requiredField))
        }
      }

      const { email, password } = httpRequest.body

      // check if the provided email is valid
      const isValid = this.emailValidator.validate(email)
      if (!isValid) {
        return badRequest(new InvalidFieldError('email'))
      }

      const accessToken = await this.authentication.authenticate({
        email,
        password
      })
      if (!accessToken) {
        return unauthorized(new UnauthenticatedLoginError())
      }
      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
