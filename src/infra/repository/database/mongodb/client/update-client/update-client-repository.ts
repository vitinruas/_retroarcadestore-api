import { IUpdateClientRepository } from '../../../../../../usecases/protocols/repository/client/update-client-repository-protocol'
import { IUpdateClientUseCaseModel } from '../../../../../../domain/usecases/client/update-client-usecase'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateClientRepository implements IUpdateClientRepository {
  async update(dataToUpdate: IUpdateClientUseCaseModel): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(dataToUpdate.uid) },
      {
        $set: {
          ...dataWithoutID
        }
      }
    )
  }
}
