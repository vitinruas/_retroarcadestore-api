import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { GetAccountByAccessTokenRepository } from '../../../../../infra/repository/database/mongodb/account/get-account-by-access-token/get-account-by-access-token-repository'
import { ICheckAccessTokenUseCase } from '../../../../../presentation/middlewares/auth-middleware-protocols'
import { CheckAccessTokenUseCase } from '../../../../../usecases/account/check-access-token/check-access-token-usecase'
import env from '../../../../config/env'

export const makeCheckAccessTokenUseCaseFactory =
  (): ICheckAccessTokenUseCase => {
    const tokenDecrypterAdapter = new JwtAdapter(env.secretKey)
    const getAccountByAccessTokenRepository =
      new GetAccountByAccessTokenRepository()
    const checkAccessTokenUseCase = new CheckAccessTokenUseCase(
      tokenDecrypterAdapter,
      getAccountByAccessTokenRepository
    )
    return checkAccessTokenUseCase
  }
