import { IAccountEntitie } from '../../../account/authentication/authentication-usecase-protocols'

export interface IGetAccountByEmailRepository {
  get(email: string): Promise<IAccountEntitie | null>
}
