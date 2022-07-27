import {
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel
} from '../../../domain/usecases/client/update-client-usecase'
import { IHasher } from '../../protocols/cryptography/hasher-protocol'
import { IUpdateClientRepository } from '../../protocols/repository/client/update-client-repository-protocol'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly passwordHasherAdapter: IHasher,
    private readonly updateClientRepository: IUpdateClientRepository
  ) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<void> {
    if (fields.password) {
      fields.password = await this.passwordHasherAdapter.hash(fields.password)
    }

    await this.updateClientRepository.update(fields)
    return Promise.resolve()
  }
}
