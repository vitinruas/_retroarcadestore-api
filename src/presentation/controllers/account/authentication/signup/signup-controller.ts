import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IAddAccountUseCase
} from './signup-controller-protocols'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../../../helpers/http-response-helper'
import { FieldAlreadyUse } from '../../../../errors/field-already-use'
import { IValidation } from '../login/login-controller-protocols'

export class SignUpController implements IController {
  constructor(
    private readonly validationComposite: IValidation,
    private readonly addAccountUseCase: IAddAccountUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const error: void | Error = await this.validationComposite.validate(
        httpRequest.body
      )
      if (error) {
        return badRequest(error)
      }

      const { name, email, password } = httpRequest.body

      // add a new account with the credentials and it should returns an access token
      const accessToken: string | null = await this.addAccountUseCase.add({
        name,
        email,
        password
      })

      if (!accessToken) {
        return forbidden(new FieldAlreadyUse('email'))
      }

      return ok({ accessToken })
    } catch (error: any) {
      return serverError(error)
    }
  }
}
