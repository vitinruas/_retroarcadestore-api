import { IAccountEntitie } from '../../entities/account'

export interface ICheckAccessTokenUseCase {
  check(accessToken: string, admin?: boolean): Promise<IAccountEntitie | null>
}
