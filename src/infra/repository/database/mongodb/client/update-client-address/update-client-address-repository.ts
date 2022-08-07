import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'
import documentHelper from '../../helpers/document-helper'
import {
  IUpdateClientAddressRepository,
  IUpdateClientAddressRepositoryModel
} from './update-client-client-repository-protocols'

export class UpdateClientAddressRepository
  implements IUpdateClientAddressRepository
{
  async update(
    dataToUpdate: IUpdateClientAddressRepositoryModel
  ): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('addresses')
    await collectionRef.updateOne(
      { _id: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          uid,
          ...dataWithoutID,
          updatedAt: documentHelper.getCurrentTime()
        }
      },
      { upsert: true }
    )
  }
}
