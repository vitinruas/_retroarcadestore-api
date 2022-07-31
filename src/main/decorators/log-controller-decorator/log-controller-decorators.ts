import { noContent } from '../../../presentation/helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../../presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.controller.perform(httpRequest)
    return Promise.resolve(noContent())
  }
}
