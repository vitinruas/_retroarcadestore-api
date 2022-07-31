import { ILogControllerUseCase } from '../../../domain/usecases/system/log/log-controller-usecase'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from '../../../presentation/protocols'

export class LogControllerDecorator implements IController {
  constructor(
    private readonly logControllerUseCase: ILogControllerUseCase,
    private readonly controller: IController
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const response: IHttpResponse = await this.controller.perform(httpRequest)
    await this.logControllerUseCase.log(httpRequest, response)
    return response
  }
}
