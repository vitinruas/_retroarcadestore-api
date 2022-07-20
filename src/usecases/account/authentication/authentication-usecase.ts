import {
  IAuthenticationModel,
  IAuthenticationUseCase
} from '../../../domain/usecases/account/authentication-usecase'
import { IGetAccountByEmailRepository } from '../add-account/add-account-usecase-protocols'

export class AuthenticationUseCase implements IAuthenticationUseCase {
  constructor(
    private readonly getAccountByEmailRepository: IGetAccountByEmailRepository
  ) {}

  async authenticate(
    authenticationData: IAuthenticationModel
  ): Promise<string | null> {
    const account = await this.getAccountByEmailRepository.get(
      authenticationData.email
    )
    if (account) {
    }
    return null
  }
}
