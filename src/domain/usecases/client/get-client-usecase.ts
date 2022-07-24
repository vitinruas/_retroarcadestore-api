import { IClientEntitie } from '../../entities/account/client-entitie'

export interface IGetClientUseCase {
  get(uid: string): Promise<IClientEntitie>
}
