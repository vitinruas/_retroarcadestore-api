import { ICheckAccessTokenUseCase } from '../../domain/usecases/account/check-access-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden, ok } from '../helpers/http-response-helper'
import { IHttpRequest, IHttpResponse } from '../protocols/http-protocol'
import { IMiddleware } from '../protocols/middleware-protocol'

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly checkAccessTokenUseCase: ICheckAccessTokenUseCase,
    private readonly admin?: boolean
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const accessToken = httpRequest.headers?.['x-access-token']
    if (accessToken) {
      await this.checkAccessTokenUseCase.check(accessToken)
      return ok()
    }
    return forbidden(new AccessDeniedError())
  }
}
