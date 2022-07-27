import { ok, serverError } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IGetClientUseCase,
  IGetClientModel
} from './get-client-controller-protocols'

export class GetClientController implements IController {
  constructor(private readonly GetClientUseCase: IGetClientUseCase) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // get client account using the provided uid by AuthMiddleware
      const client: IGetClientModel = await this.GetClientUseCase.get(
        httpRequest.body?.uid
      )
      return ok(client)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
