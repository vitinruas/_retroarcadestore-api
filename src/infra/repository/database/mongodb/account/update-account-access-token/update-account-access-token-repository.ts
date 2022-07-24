import { IUpdateAccountAccessTokenRepository } from './update-account-access-token-repository-protocols'
import mongoose from 'mongoose'
import entitieHelper from '../../helpers/entitie-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateAccountAccessTokenMongoRepository
  implements IUpdateAccountAccessTokenRepository
{
  async update(id: string, accessToken: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          accessToken,
          authenticatedAt: entitieHelper.getCurrentTime()
        }
      }
    )
  }
}
