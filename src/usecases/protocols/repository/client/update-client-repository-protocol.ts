import { IUpdateClientUseCaseModel } from '../../../../domain/usecases/client/update-client-usecase'

export interface IUpdateClientRepository {
  update(dataToUpdate: IUpdateClientUseCaseModel): Promise<void>
}
