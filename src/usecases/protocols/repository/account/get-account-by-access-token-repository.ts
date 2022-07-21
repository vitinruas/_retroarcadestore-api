import { IAccountEntitie } from '../../../account/authentication/authentication-usecase-protocols'

export interface IGetAccountByAccessTokenRepository {
  get(token: string, isAdmin?: boolean): Promise<IAccountEntitie | null>
}
