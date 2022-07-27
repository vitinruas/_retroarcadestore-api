import { IAccountEntitie } from '../../../account/authentication/authentication-usecase-protocols'

export interface IGetAccountByUIDRepository {
  get(uid: string): Promise<IAccountEntitie>
}
