import { AuthMiddleware } from '../../../../presentation/middlewares/auth-middleware'
import { IMiddleware } from '../../../../presentation/protocols/middleware-protocol'
import { makeCheckAccessTokenUseCase } from '../../usecases/account/check-access-token/check-access-token-factory'
export const makeAuthMiddlewareFactory = (isAdmin?: boolean): IMiddleware => {
  const checkAccessTokenUseCase = makeCheckAccessTokenUseCase()
  const authMiddleware = new AuthMiddleware(checkAccessTokenUseCase, isAdmin)
  return authMiddleware
}
