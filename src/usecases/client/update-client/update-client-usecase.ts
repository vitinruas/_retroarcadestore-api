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
    // check if a password was provided
    if (fields.password) {
      const account = await this.getAccountByUIDRepository.get(fields.uid)
      // check if the password is valid
      const isValid = await this.passwordHashComparerAdapter.compare(
        fields.password,
        account.password
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
