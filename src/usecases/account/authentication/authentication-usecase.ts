import {
  IAuthenticationModel,
  IAuthenticationUseCase
} from '../../../domain/usecases/account/authentication-usecase'
import { IHashComparer } from '../../protocols/cryptography/hash-comparer-protocol'
import {
  IAccountEntitie,
  IGetAccountByEmailRepository
} from '../add-account/add-account-usecase-protocols'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHashComparer: IHashComparer
  ) {}

  async authenticate(
    authenticationData: IAuthenticationModel
  ): Promise<string | null> {
    const account: IAccountEntitie = await this.getAccountByEmailRepository.get(
      authenticationData.email
    )
    if (account) {
      await this.passwordHashComparer.compare(
        authenticationData.password,
        account.password
      )
    }
    return null
  }
}
