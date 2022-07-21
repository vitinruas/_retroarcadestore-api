import { ICheckAccessTokenUseCase } from '../../../domain/usecases/account/check-access-token-usecase'
import {
  IGetAccountByAccessTokenRepository,
  IDecrypter,
  IAccountEntitie
} from './check-access-token-usecase-protocols'

export class CheckAccessTokenUseCase implements ICheckAccessTokenUseCase {
  constructor(
    private readonly tokenDecrypterAdapter: IDecrypter,
    private readonly getAccountByAccessTokenRepository: IGetAccountByAccessTokenRepository
  ) {}

  async check(
    accessToken: string,
    isAdmin: boolean
  ): Promise<IAccountEntitie | null> {
    // check if provided access token is valid and return it
    const isValid: string | null = await this.tokenDecrypterAdapter.decrypt(
      accessToken
    )
    if (isValid) {
      // check if there are account with this access token
      const account = await this.getAccountByAccessTokenRepository.get(
        accessToken,
        isAdmin
      )
      // return an account if all validations above succeeds
      if (account) {
        return account
      }
    }
    return Promise.resolve(null)
  }
}
