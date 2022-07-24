import { ok, serverError } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IGetAccountUseCase
} from './get-account-controller-protocols'

export class GetAccountController implements IController {
  constructor(private readonly getAccountUseCase: IGetAccountUseCase) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const account = await this.getAccountUseCase.get(httpRequest.body?.id)
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
