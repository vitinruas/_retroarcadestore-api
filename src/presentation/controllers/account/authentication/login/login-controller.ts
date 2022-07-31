import { UnauthenticatedLoginError } from '../../../../errors/unauthenticated-error'
import {
  badRequest,
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
      const error: void | Error = await this.validationComposite.validate(
        httpRequest.body
      )
      if (error) {
        return badRequest(error)
      }

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
