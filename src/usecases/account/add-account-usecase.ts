import {
  IAccountEntitie,
  IAddAccountModel,
  IGetAccountByEmailRepository,
  IHasher,
  IEncrypter,
  IAddAccountRepository,
  IAddAccountUseCase,
  IUpdateAccountAccessToken
} from './add-account-protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly tokenGenerator: IEncrypter,
    private readonly updateAccountAccessTokenStub: IUpdateAccountAccessToken
  ) {}

  async add(newAccountData: IAddAccountModel): Promise<string | null> {
    const account = await this.getAccountByEmailRepository.get(
      newAccountData.email
    )
    if (!account) {
      const hashedPassword: string = await this.passwordHasher.hash(
        newAccountData.password
      )
      const createdAccount: IAccountEntitie =
        await this.addAccountRepository.add(
          Object.assign({}, newAccountData, { password: hashedPassword })
        )

      const accessToken: string = await this.tokenGenerator.encrypt(
        createdAccount.id
      )
      await this.updateAccountAccessTokenStub.updateToken(
        createdAccount.id,
        accessToken
      )
      return accessToken
    }
    return null
  }
}
