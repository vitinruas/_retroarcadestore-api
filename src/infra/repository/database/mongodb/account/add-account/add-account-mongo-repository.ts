import { Collection } from 'mongoose'
import {
  IAccountEntitie,
  IAddAccountModel,
  IAddAccountRepository
} from './add-account-repository.protocols'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class AddAccountMongoRepository implements IAddAccountRepository {
  async add(newAccountData: IAddAccountModel): Promise<IAccountEntitie> {
    const collectionRef: Collection = mongoHelper.getCollection('accounts')
    const createdAccountID = (
      await collectionRef.insertOne({
        ...newAccountData,
        createdAt: documentHelper.getCurrentTime()
      })
    ).insertedId
    const createdAccount = await collectionRef.findOne({
      _id: createdAccountID
    })
    return mongoHelper.replaceMongoID(createdAccount, 'uid')
  }
}
