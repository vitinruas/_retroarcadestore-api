import { IAccountEntitie } from '../../entities/account'

export interface ICheckAccessTokenUseCase {
  check(accessToken: string, isAdmin?: boolean): Promise<IAccountEntitie | null>
}
