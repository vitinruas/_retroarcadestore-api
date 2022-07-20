import {
  IAuthenticationUseCase,
  IAuthenticationModel,
  IHashComparer,
  IAccountEntitie,
  IEncrypter,
  IGetAccountByEmailRepository,
  IUpdateAccountAccessToken
} from './authentication-usecase-protocols'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHashComparerAdapter: IHashComparer,
    private readonly tokenGeneratorAdapter: IEncrypter,
    private readonly updateAccountAccessTokenRepository: IUpdateAccountAccessToken
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
