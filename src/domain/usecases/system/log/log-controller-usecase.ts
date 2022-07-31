import { IHttpRequest, IHttpResponse } from '../../../../presentation/protocols'

export interface ILogControllerUseCase {
  log(request: IHttpRequest, response: IHttpResponse): Promise<void>
}
