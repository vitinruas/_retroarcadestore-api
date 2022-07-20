import { IAuthenticationUseCase } from '../../../../../domain/usecases/account/authentication-usecase'
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { GetAccountByEmailMongoRepository } from '../../../../../infra/repository/database/mongodb/account/get-account-by-email/get-account-by-email-repository'
import { UpdateAccountAccessTokenMongoRepository } from '../../../../../infra/repository/database/mongodb/account/update-account-access-token/update-account-access-token-repository'
import { AuthenticationUseCase } from '../../../../../usecases/account/authentication/authentication-usecase'
import env from '../../../../config/env'

export const makeAuthenticationUseCaseFactory = (): IAuthenticationUseCase => {
  const getAccountByEmailMongoRepository =
    new GetAccountByEmailMongoRepository()
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt)
  const jwtAdapter = new JwtAdapter(env.secretKey)
  const updateAccountAccessTokenMongoRepository =
    new UpdateAccountAccessTokenMongoRepository()
  const authenticationUseCase = new AuthenticationUseCase(
    getAccountByEmailMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    updateAccountAccessTokenMongoRepository
  )
  return authenticationUseCase
}
