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
    const isValid: string | null = await this.tokenDecrypterAdapter.decrypt(
      accessToken
    )
    if (isValid) {
      return {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      }
    }
    return Promise.resolve(null)
  }
}
