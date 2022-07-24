import { IClientEntitie } from '../../entities/account/client-entitie'

export interface IGetAccountUseCase {
  get(id: string): Promise<IClientEntitie>
}
