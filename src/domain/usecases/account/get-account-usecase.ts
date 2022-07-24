import { IAccountEntitie } from '../../entities/account/account-entitie'

export interface IGetAccountUseCase {
  get(id: string): Promise<IAccountEntitie>
}
