import { IHttpRequest, IHttpResponse } from './http-protocol'

export interface IMiddleware {
  handle(httpRequest: IHttpRequest): Promise<IHttpResponse>
}
