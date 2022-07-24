import { ok, serverError } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IGetClientUseCase
} from './get-client-controller-protocols'

export class GetClientController implements IController {
  constructor(private readonly GetClientUseCase: IGetClientUseCase) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const account = await this.GetClientUseCase.get(httpRequest.body?.uid)
      return ok(account)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
