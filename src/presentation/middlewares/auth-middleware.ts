import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http-response-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'
import { IMiddleware } from '../protocols/middleware-protocol'

export class AuthMiddleware implements IMiddleware {
  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      return ok()
    }
    return forbidden(new AccessDeniedError())
  }
}
