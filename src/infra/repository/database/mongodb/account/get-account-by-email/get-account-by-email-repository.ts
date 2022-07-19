import mongoose from 'mongoose'
import {
  IAccountEntitie,
  IGetAccountByEmailRepository
} from 'src/usecases/account/add-account-protocols'
import mongoHelper from '../../helpers/mongo-helper'

export class GetAccountByEmailMongoRepository
  implements IGetAccountByEmailRepository
{
  async get(email: string): Promise<IAccountEntitie | null> {
    const collectionRef = mongoose.connection.collection('accounts')
    const document = await collectionRef.findOne({ email })

    return (document && mongoHelper.replaceMongoID(document)) || null
  }
}
