import {
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel
} from '../../../domain/usecases/client/update-client-usecase'
import { IHasher } from '../../protocols/cryptography/hasher-protocol'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(private readonly passwordHasherAdapter: IHasher) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<void> {
    if (fields.password) {
      await this.passwordHasherAdapter.hash(fields.password)
    }
    return Promise.resolve()
  }
}
