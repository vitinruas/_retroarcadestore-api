import {
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel
} from '../../../domain/usecases/client/update-client-usecase'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer-protocol'
import { IHasher } from '../../protocols/cryptography/hasher-protocol'
import { IUpdateClientRepository } from '../../protocols/repository/client/update-client-repository-protocol'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly passwordHasherAdapter: IHasher,
    private readonly updateClientRepository: IUpdateClientRepository
  ) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<boolean> {
    // check if a password was provided
    if (fields.password) {
      // check if the password is valid
      const isValid = await this.passwordHashComparerAdapter.compare(
        fields.password,
        ''
      )
      // if valid, then update security fields
      if (isValid) {
        if (fields.newPassword) {
          fields.newPassword = await this.passwordHasherAdapter.hash(
            fields.newPassword
          )
        }
      }
    }
    await this.updateClientRepository.update(fields)
    return true
  }
}
