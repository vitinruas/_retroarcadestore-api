import { IHttpRequest, IHttpResponse } from './http-protocol'

export interface IController {
  perform(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
