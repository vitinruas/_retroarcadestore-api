import { UnauthenticatedLoginError } from '../../../../errors/unauthenticated-error'
import {
  ok,
  serverError,
  unauthorized
} from '../../../../helpers/http-response-helper'
import {
  IController,
  IValidation,
  IHttpRequest,
  IHttpResponse,
  IAuthenticationUseCase
} from './login-controller-protocols'

export class LoginController implements IController {
  constructor(
    private readonly validationComposite: IValidation,
    private readonly authentication: IAuthenticationUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      await this.validationComposite.validate(httpRequest.body)
      const { email, password } = httpRequest.body
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
