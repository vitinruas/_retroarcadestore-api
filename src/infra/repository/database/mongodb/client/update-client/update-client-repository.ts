import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'
import {
  IUpdateClientRepository,
  IUpdateClientUseCaseModel
} from './update-client-repository-protocols'

export class UpdateClientRepository implements IUpdateClientRepository {
  async update(dataToUpdate: IUpdateClientUseCaseModel): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.updateOne(
      { _id: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          ...dataWithoutID
        }
      }
    )
  }
}
