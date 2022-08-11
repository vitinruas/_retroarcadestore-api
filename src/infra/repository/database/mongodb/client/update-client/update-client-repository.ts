import {
  IUpdateClientRepository,
  IUpdateClientRepositoryModel
} from './update-client-repository-protocols'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateClientRepository implements IUpdateClientRepository {
  async update(dataToUpdate: IUpdateClientRepositoryModel): Promise<void> {
    const { uid, ...dataWithoutID } = dataToUpdate
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.updateOne(
      { _id: mongoHelper.createMongoID(uid) },
      {
        $set: {
          ...dataWithoutID,
          updatedAt: documentHelper.getCurrentTime()
        }
      }
    )
  }
}
