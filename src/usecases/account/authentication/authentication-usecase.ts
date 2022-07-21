import {
  IAuthenticationUseCase,
  IAuthenticationModel,
  IHashComparer,
  IAccountEntitie,
  IEncrypter,
  IGetAccountByEmailRepository,
  IUpdateAccountAccessTokenRepository
} from './authentication-usecase-protocols'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly tokenGeneratorAdapter: IEncrypter,
    private readonly updateAccountAccessTokenRepository: IUpdateAccountAccessTokenRepository
  ) {}

  async authenticate(
    authenticationData: IAuthenticationModel
  ): Promise<string | null> {
    const account: IAccountEntitie | null =
      await this.getAccountByEmailRepository.get(authenticationData.email)
    if (account) {
      const isValid = await this.passwordHashComparerAdapter.compare(
        authenticationData.password,
        account.password
      )
      if (isValid) {
        const accessToken = await this.tokenGeneratorAdapter.encrypt(account.id)
        await this.updateAccountAccessTokenRepository.update(
          account.id,
          accessToken
        )
        return accessToken
      }
    }
    return null
  }
}
