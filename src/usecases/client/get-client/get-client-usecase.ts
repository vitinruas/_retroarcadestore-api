import { IClientEntitie } from '../../../domain/entities/account/client-entitie'
import { IGetClientUseCase } from '../../../domain/usecases/client/get-client-usecase'
import { IGetClientByUIDRepository } from '../../protocols/repository/client/get-client-by-uid-repository-protocol'

export class GetClientUseCase implements IGetClientUseCase {
  constructor(
    private readonly getClientByUIDRepository: IGetClientByUIDRepository
  ) {}

  async get(uid: string): Promise<IClientEntitie> {
    const account = await this.getClientByUIDRepository.get(uid)
    return account
  }
}
