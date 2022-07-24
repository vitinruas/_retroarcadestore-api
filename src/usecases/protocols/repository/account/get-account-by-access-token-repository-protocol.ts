import { IAccountEntitie } from '../../../account/authentication/authentication-usecase-protocols'

export interface IGetAccountByAccessTokenRepository {
  get(accessToken: string, isAdmin?: boolean): Promise<IAccountEntitie | null>
}
