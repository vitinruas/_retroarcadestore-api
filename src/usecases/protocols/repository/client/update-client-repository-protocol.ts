import { IUpdateClientUseCaseModel } from '../../../../domain/usecases/client/update-client-usecase'
import { IGetClientModel } from '../../../client/get-client/get-client-usecase-protocols'

export interface IUpdateClientRepository {
  update(data: IUpdateClientUseCaseModel): Promise<IGetClientModel>
}
