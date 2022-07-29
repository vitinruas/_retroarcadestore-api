import mongoHelper from '../../helpers/mongo-helper'
import {
  IAccountEntitie,
  IGetAccountByAccessTokenRepository
} from './get-account-by-access-token-repository-protocols'

export class GetAccountByAccessTokenRepository
  implements IGetAccountByAccessTokenRepository
{
  async get(
    accessToken: string,
    isAdmin?: boolean
  ): Promise<IAccountEntitie | null> {
    const collectionRef = mongoHelper.getCollection('accounts')
    const document = await collectionRef.findOne({ accessToken, isAdmin })
    return (document && mongoHelper.replaceMongoID(document, 'uid')) || null
  }
}
