import {
  IAccountEntitie,
  ICheckAccessTokenUseCase
} from '../../../presentation/middlewares/auth-middleware-protocols'
import { IDecrypter } from '../../protocols/cryptography/decrypter-protocol'

export class CheckAccessTokenUseCase implements ICheckAccessTokenUseCase {
  constructor(private readonly tokenDecrypterAdapter: IDecrypter) {}

  async check(
    accessToken: string,
    admin?: boolean | undefined
  ): Promise<IAccountEntitie | null> {
    await this.tokenDecrypterAdapter.decrypt(accessToken)
    return Promise.resolve(null)
  }
}
