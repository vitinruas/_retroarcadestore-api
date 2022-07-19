import {
  IAddAccountModel,
  IAddAccountUseCase
} from 'src/domain/usecases/account/add-account-usecase'
import { IGetAccountByEmailRepository } from '../protocols/account/get-account-by-email-repository'
import { IHasher } from '../protocols/account/hasher-protocol'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHasher: IHasher
  ) {}

  async add(newAccountData: IAddAccountModel): Promise<string | null> {
    const account = await this.getAccountByEmailRepository.get(
      newAccountData.email
    )
    if (!account) {
      await this.passwordHasher.hash(newAccountData.password)
    }
    return null
  }
}
