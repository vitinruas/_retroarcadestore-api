import { IGetClientUseCase } from '../../../../../domain/usecases/client/get-client-usecase'
import { GetClientByUIDRepository } from '../../../../../infra/repository/database/mongodb/client/get-account-by-uid/get-account-by-uid-repository'
import { GetClientUseCase } from '../../../../../usecases/client/get-client/get-client-usecase'

export const makeGetClientFactory = (): IGetClientUseCase => {
  const getClientByUIDRepository = new GetClientByUIDRepository()
  const getClientUseCase = new GetClientUseCase(getClientByUIDRepository)
  return getClientUseCase
}
