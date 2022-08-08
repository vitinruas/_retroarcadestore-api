import mongoHelper from '../../helpers/mongo-helper'
import {
  IUpdateClientAddressRepository,
  IUpdateClientAddressRepositoryModel
} from './update-client-client-repository-protocols'
import mongoose from 'mongoose'

export class UpdateClientAddressRepository
  implements IUpdateClientAddressRepository
{
  async update(
    dataToUpdate: IUpdateClientAddressRepositoryModel
  ): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('addresses')
    await collectionRef.updateOne(
      { uid: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          uid: new mongoose.Types.ObjectId(uid),
          ...dataWithoutID
        }
      },
      { upsert: true }
    )
  }
}
