import {
  IAccountEntitie,
  IGetAccountByUIDRepository
} from './get-account-by-uid-repository-protocols'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'

export class GetClientByUIDRepository implements IGetAccountByUIDRepository {
  async get(uid: string): Promise<IAccountEntitie> {
    const collectionRef = mongoose.connection.collection('accounts')
    const document = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(uid)
    })
    return mongoHelper.replaceMongoID(document)
  }
}
