import { IUpdateClientUseCase } from '../../../../../domain/usecases/client/update-client-usecase'
import { GetAccountByUIDRepository } from '../../../../../infra/repository/database/mongodb/account/get-account-by-uid/get-account-by-uid-repository'
import { UpdateClientRepository } from '../../../../../infra/repository/database/mongodb/client/update-client/update-client-repository'
import { UpdateClientUseCase } from '../../../../../usecases/client/update-client/update-client-usecase'
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter'
import env from '../../../../config/env'
import { UpdateClientAddressRepository } from '../../../../../infra/repository/database/mongodb/client/update-client-address/update-client-address-repository'

export const makeUpdateClientUseCase = (): IUpdateClientUseCase => {
  const getAccountByUIDRepository = new GetAccountByUIDRepository()
  const bcryptAdapter = new BcryptAdapter(env.bcryptSalt)
  const updateClientRepository = new UpdateClientRepository()
  const updateClientAddressRepository = new UpdateClientAddressRepository()
  const updateClientUseCase = new UpdateClientUseCase(
    getAccountByUIDRepository,
    bcryptAdapter,
    bcryptAdapter,
    updateClientRepository,
    updateClientAddressRepository
  )
  return updateClientUseCase
}
