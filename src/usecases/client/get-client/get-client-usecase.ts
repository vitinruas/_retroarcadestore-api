import { IClientEntitie } from '../../../domain/entities/account/client-entitie'
import { IGetClientUseCase } from '../../../domain/usecases/client/get-client-usecase'
import { IGetClientByUIDRepository } from '../../protocols/repository/client/get-client-by-uid-repository-protocol'

export class GetClientUseCase implements IGetClientUseCase {
  constructor(
    private readonly getClientByUIDRepository: IGetClientByUIDRepository
  ) {}

  async get(uid: string): Promise<IClientEntitie> {
    await this.getClientByUIDRepository.get(uid)
    return Promise.resolve({
      uid: 'any_uid',
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password',
      accessToken: 'any_token'
    })
  }
}
