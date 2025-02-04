import mongoose from 'mongoose'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'
import {
  IUpdateClientRepository,
  IUpdateClientRepositoryModel
} from './update-client-repository-protocols'

export class UpdateClientRepository implements IUpdateClientRepository {
  async update(dataToUpdate: IUpdateClientRepositoryModel): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.updateOne(
      { _id: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          ...dataWithoutID,
          updatedAt: documentHelper.getCurrentTime()
        }
      }
    )
  }
}
