import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter'
import { AddAccountMongoRepository } from '../../../../../infra/repository/database/mongodb/account/add-account/add-account-mongo-repository'
import { GetAccountByEmailMongoRepository } from '../../../../../infra/repository/database/mongodb/account/get-account-by-email/get-account-by-email-repository'
import { UpdateAccountAccessTokenMongoRepository } from '../../../../../infra/repository/database/mongodb/account/update-account-access-token/update-account-access-token-repository'
import { AddAccountUseCase } from '../../../../../usecases/account/add-account-usecase'
import { IAddAccountUseCase } from '../../../../../usecases/account/add-account-protocols'
import env from 'src/main/config/env'

export const makeAddAccountUseCaseFactory = (): IAddAccountUseCase => {
  const getAccountByEmailMongoRepository =
    new GetAccountByEmailMongoRepository()
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt)
  const addAccountMongoRepository = new AddAccountMongoRepository()
  const jwtAdapter = new JwtAdapter(env.secretKey)
  const updateAccountAccessTokenMongoRepository =
    new UpdateAccountAccessTokenMongoRepository()
  const addAccountUseCase = new AddAccountUseCase(
    getAccountByEmailMongoRepository,
    bcryptAdapter,
    addAccountMongoRepository,
    jwtAdapter,
    updateAccountAccessTokenMongoRepository
  )
  return addAccountUseCase
}
