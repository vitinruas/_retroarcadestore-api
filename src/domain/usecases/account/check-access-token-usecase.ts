import { IAccountEntitie } from '../../entities/account'

export interface ICheckAccessTokenUseCase {
  check(accessToken: string): Promise<IAccountEntitie | null>
}
