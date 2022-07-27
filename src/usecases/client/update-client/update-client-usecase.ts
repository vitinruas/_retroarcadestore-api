import {
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel
} from '../../../domain/usecases/client/update-client-usecase'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer-protocol'
import { IHasher } from '../../protocols/cryptography/hasher-protocol'
import { IUpdateClientRepository } from '../../protocols/repository/client/update-client-repository-protocol'
import { IGetClientByUIDRepository } from '../get-client/get-client-usecase-protocols'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly getClientByUIDRepository: IGetClientByUIDRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly passwordHasherAdapter: IHasher,
    private readonly updateClientRepository: IUpdateClientRepository
  ) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<boolean> {
    // check if a password was provided
    if (fields.password) {
      const account = await this.getClientByUIDRepository.get(fields.uid)
      // check if the password is valid
      const isValid = await this.passwordHashComparerAdapter.compare(
        fields.password,
        ''
      )
      // if invalid then returns false
      if (!isValid) {
        return false
      }

      if (fields.newPassword) {
        fields.newPassword = await this.passwordHasherAdapter.hash(
          fields.newPassword
        )
      }
    }
    await this.updateClientRepository.update(fields)
    return true
  }
}
