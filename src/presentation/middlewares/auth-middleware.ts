import {
  IMiddleware,
  IHttpRequest,
  IHttpResponse,
  IAccountEntitie
} from './auth-middleware-protocols'
import { ICheckAccessTokenUseCase } from '../../domain/usecases/account/check-access-token-usecase'
import { AccessDeniedError } from '../errors'
import { forbidden, ok, serverError } from '../helpers/http-response-helper'

export class AuthMiddleware implements IMiddleware {
  constructor(
    private readonly checkAccessTokenUseCase: ICheckAccessTokenUseCase,
    private readonly admin?: boolean
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account: IAccountEntitie | null =
          await this.checkAccessTokenUseCase.check(accessToken)
        if (account) {
          return ok({ id: account.id })
        }
      }
      return forbidden(new AccessDeniedError())
    } catch (error: any) {
      return serverError(error)
    }
  }
}
