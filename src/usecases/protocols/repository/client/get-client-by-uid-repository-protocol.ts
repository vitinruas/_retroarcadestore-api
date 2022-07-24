import { IGetClientModel } from '../../../../domain/usecases/client/get-client-usecase'

export interface IGetClientByUIDRepository {
  get(uid: string): Promise<IGetClientModel>
}
