import {
  IGetAccountByEmailRepository,
  IAccountEntitie
} from './get-account-by-email-repository-protocols'
import mongoHelper from '../../helpers/mongo-helper'

export class GetAccountByEmailMongoRepository
  implements IGetAccountByEmailRepository
{
  async get(email: string): Promise<IAccountEntitie | null> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const document = await collectionRef.findOne({ email })

    return (document && mongoHelper.replaceMongoID(document, 'uid')) || null
  }
}
