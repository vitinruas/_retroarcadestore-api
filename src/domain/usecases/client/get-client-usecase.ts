import { IClientEntitie } from '../../entities/account/client-entitie'

export interface IGetClientUseCase {
  get(id: string): Promise<IClientEntitie>
}
