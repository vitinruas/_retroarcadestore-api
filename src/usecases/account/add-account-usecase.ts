import {
  IAddAccountModel,
  IAddAccountUseCase
} from 'src/domain/usecases/account/add-account-usecase'
import { IAddAccountRepository } from '../protocols/account/add-account-repository'
import { IGetAccountByEmailRepository } from '../protocols/account/get-account-by-email-repository'
import { IHasher } from '../protocols/account/hasher-protocol'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async add(newAccountData: IAddAccountModel): Promise<string | null> {
    const account = await this.getAccountByEmailRepository.get(
      newAccountData.email
    )
    if (!account) {
      const hashedPassword = await this.passwordHasher.hash(
        newAccountData.password
      )
      await this.addAccountRepository.add(
        Object.assign({}, newAccountData, { password: hashedPassword })
      )
    }
    return null
  }
}
