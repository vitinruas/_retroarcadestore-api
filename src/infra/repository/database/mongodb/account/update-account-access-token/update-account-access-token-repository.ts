import { IUpdateAccountAccessTokenRepository } from './update-account-access-token-repository-protocols'
import mongoose from 'mongoose'
import documentHelper from '../../helpers/document-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateAccountAccessTokenMongoRepository
  implements IUpdateAccountAccessTokenRepository
{
  async update(uid: string, accessToken: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          accessToken,
          authenticatedAt: documentHelper.getCurrentTime()
        }
      }
    )
  }
}
