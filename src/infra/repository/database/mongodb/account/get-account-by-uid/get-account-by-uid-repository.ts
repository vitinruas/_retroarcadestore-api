import {
  IAccountEntitie,
  IGetAccountByUIDRepository
} from './get-account-by-uid-repository-protocols'
import mongoHelper from '../../helpers/mongo-helper'

export class GetAccountByUIDRepository implements IGetAccountByUIDRepository {
  async get(uid: string): Promise<IAccountEntitie> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const document = await collectionRef.findOne({
      _id: mongoHelper.createMongoID(uid)
    })
    return mongoHelper.replaceMongoID(document, 'uid')
  }
}
