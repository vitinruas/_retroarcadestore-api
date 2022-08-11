import {
  IUpdateClientAddressRepository,
  IUpdateClientAddressRepositoryModel
} from './update-client-client-repository-protocols'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateClientAddressRepository
  implements IUpdateClientAddressRepository
{
  async update(
    dataToUpdate: IUpdateClientAddressRepositoryModel
  ): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('addresses')
    await collectionRef.updateOne(
      { uid: mongoHelper.createMongoID(uid) },
      {
        $set: {
          uid: mongoHelper.createMongoID(uid),
          ...dataWithoutID
        }
      },
      { upsert: true }
    )
  }
}
