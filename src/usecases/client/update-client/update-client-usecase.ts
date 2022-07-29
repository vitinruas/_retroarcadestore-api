import { IAccountEntitie } from '../../account/authentication/authentication-usecase-protocols'
import {
  IUpdateClientUseCase,
  IGetAccountByUIDRepository,
  IHashComparer,
  IHasher,
  IUpdateClientRepository,
  IUpdateClientUseCaseModel
} from './update-client-usecase-protocols'

export class UpdateClientUseCase implements IUpdateClientUseCase {
  constructor(
    private readonly getAccountByUIDRepository: IGetAccountByUIDRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly passwordHasherAdapter: IHasher,
    private readonly updateClientRepository: IUpdateClientRepository
  ) {}

  async update(fields: IUpdateClientUseCaseModel): Promise<boolean> {
    const { newPassword, ...dataToUpdate } = fields

    // check if a password was provided
    if (dataToUpdate.password) {
      const account: IAccountEntitie = await this.getAccountByUIDRepository.get(
        dataToUpdate.uid
      )
      // check if the password is valid
      const isValid: boolean = await this.passwordHashComparerAdapter.compare(
        dataToUpdate.password,
        account.password
      )
      // if invalid then returns false
      if (!isValid) {
        return false
      }
      if (newPassword) {
        const hashedPassword = await this.passwordHasherAdapter.hash(
          newPassword
        )

        Object.assign(dataToUpdate, {
          password: hashedPassword || account.password
        })
      }
    }

    await this.updateClientRepository.update(dataToUpdate)
    return true
  }
}
