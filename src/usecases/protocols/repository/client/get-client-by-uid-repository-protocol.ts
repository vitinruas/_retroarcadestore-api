import { IClientEntitie } from '../../../../domain/entities/account/client-entitie'

export interface IGetClientByUIDRepository {
  get(uid: string): Promise<IClientEntitie>
}
