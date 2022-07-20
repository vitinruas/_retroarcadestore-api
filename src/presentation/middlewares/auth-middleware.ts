import { ok } from '../helpers/http-response-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'
import { IMiddleware } from '../protocols/middleware-protocol'

export class AuthMiddleware implements IMiddleware {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    return Promise.resolve(ok())
  }
}
