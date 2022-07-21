import { IAccountEntitie } from '../../../domain/entities/account'
import { ICheckAccessTokenUseCase } from '../../../domain/usecases/account/check-access-token-usecase'
import { IDecrypter } from '../../protocols/cryptography/decrypter-protocol'
import { IGetAccountByAccessTokenRepository } from '../../protocols/repository/account/get-account-by-access-token-repository'

export class CheckAccessTokenUseCase implements ICheckAccessTokenUseCase {
  constructor(
    private readonly isAdmin: boolean,
    private readonly tokenDecrypterAdapter: IDecrypter,
    private readonly getAccountByAccessTokenRepository: IGetAccountByAccessTokenRepository
  ) {}

  async check(accessToken: string): Promise<IAccountEntitie | null> {
    const isValid: string | null = await this.tokenDecrypterAdapter.decrypt(
      accessToken
    )
    if (isValid) {
      await this.getAccountByAccessTokenRepository.get(
        accessToken,
        this.isAdmin
      )
    }
    return Promise.resolve(null)
  }
}
