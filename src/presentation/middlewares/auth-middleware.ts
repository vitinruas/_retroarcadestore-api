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
    private readonly isAdmin?: boolean
  ) {}

  async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      // check if there are access token
      const accessToken = httpRequest.headers?.['x-access-token']
      if (accessToken) {
        // check if provided access token is valid
        const account: IAccountEntitie | null =
          await this.checkAccessTokenUseCase.check(accessToken, this.isAdmin)
        // return an account ID to next Middleware if all validations above succeeds
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
