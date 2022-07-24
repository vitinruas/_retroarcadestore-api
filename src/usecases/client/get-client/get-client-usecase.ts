import {
  IGetClientUseCase,
  IGetClientModel
} from './get-client-usecase-protocols'
import { IGetClientByUIDRepository } from '../../protocols/repository/client/get-client-by-uid-repository-protocol'

export class GetClientUseCase implements IGetClientUseCase {
  constructor(
    private readonly getClientByUIDRepository: IGetClientByUIDRepository
  ) {}

  async get(uid: string): Promise<IGetClientModel> {
    const account = await this.getClientByUIDRepository.get(uid)
    return account
  }
}
