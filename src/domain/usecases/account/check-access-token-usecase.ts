import { IAccountEntitie } from '../../entities/account/account-entitie'

export interface ICheckAccessTokenUseCase {
  check(accessToken: string, isAdmin?: boolean): Promise<IAccountEntitie | null>
}
