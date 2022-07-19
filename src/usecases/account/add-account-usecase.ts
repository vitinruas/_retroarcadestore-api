import {
  IAddAccountModel,
  IAddAccountUseCase
} from 'src/domain/usecases/account/add-account-usecase'
import { IHasher } from '../protocols/account/hasher-protocol'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(private readonly passwordHasher: IHasher) {}

  async add(newAccountData: IAddAccountModel): Promise<string | null> {
    await this.passwordHasher.hash(newAccountData.password)
    return null
  }
}
