import {
  IAccountEntitie,
  IAddAccountModel,
  IGetAccountByEmailRepository,
  IHasher,
  IEncrypter,
  IAddAccountRepository,
  IAddAccountUseCase,
  IUpdateAccountAccessTokenRepository
} from './add-account-usecase-protocols'

export class AddAccountUseCase implements IAddAccountUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository,
    private readonly passwordHasher: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly tokenGeneratorAdapter: IEncrypter,
    private readonly updateAccountAccessTokenStubRepository: IUpdateAccountAccessTokenRepository
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

      const accessToken: string = await this.tokenGeneratorAdapter.encrypt(
        createdAccount.id
      )
      await this.updateAccountAccessTokenStubRepository.update(
        createdAccount.id,
        accessToken
      )
      return accessToken
    }
    return null
  }
}
