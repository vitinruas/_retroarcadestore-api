import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../../presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor(private readonly controller: IController) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response: IHttpResponse = await this.controller.perform(httpRequest)
    return response
  }
}
