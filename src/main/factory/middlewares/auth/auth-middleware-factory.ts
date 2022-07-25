import { AuthMiddleware } from '../../../../presentation/middlewares/auth/auth-middleware'
import { IMiddleware } from '../../../../presentation/protocols/middleware-protocol'
import { makeCheckAccessTokenUseCaseFactory } from '../../usecases/account/check-access-token/check-access-token-usecase-factory'
export const makeAuthMiddlewareFactory = (isAdmin?: boolean): IMiddleware => {
  const checkAccessTokenUseCase = makeCheckAccessTokenUseCaseFactory()
  const authMiddleware = new AuthMiddleware(checkAccessTokenUseCase, isAdmin)
  return authMiddleware
}
