import {
  IAuthenticationModel,
  IAuthenticationUseCase
} from '../../../domain/usecases/account/authentication-usecase'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer-protocol'
import {
  IAccountEntitie,
  IEncrypter,
  IGetAccountByEmailRepository
} from '../add-account/add-account-usecase-protocols'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly tokenGeneratorAdapter: IEncrypter
  ) {}

  async authenticate(
    authenticationData: IAuthenticationModel
  ): Promise<string | null> {
    const account: IAccountEntitie = await this.getAccountByEmailRepository.get(
      authenticationData.email
    )
    if (account) {
      const isValid = await this.passwordHashComparerAdapter.compare(
        authenticationData.password,
        account.password
      )
      if (isValid) {
        await this.tokenGeneratorAdapter.encrypt(account.id)
      }
    }
    return null
  }
}
