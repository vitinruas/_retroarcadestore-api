import {
  IAccountEntitie,
  IAddAccountModel,
  IAddAccountRepository
} from './add-account-repository.protocols'
import accountHelper from '../../helpers/account-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class AddAccountMongoRepository implements IAddAccountRepository {
  async add(newAccountData: IAddAccountModel): Promise<IAccountEntitie> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const createdAccountID = (
      await collectionRef.insertOne({
        ...newAccountData,
        createdAt: accountHelper.getCurrentTime()
      })
    ).insertedId
    const createdAccount = await collectionRef.findOne({
      _id: createdAccountID
    })
    return mongoHelper.replaceMongoID(createdAccount)
  }
}
