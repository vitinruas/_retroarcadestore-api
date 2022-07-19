import { IUpdateAccountAccessToken } from './update-account-access-token-protocols'
import mongoose from 'mongoose'
import accountHelper from '../../helpers/account-helper'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateAccountAccessToken implements IUpdateAccountAccessToken {
  async update(id: string, accessToken: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          accessToken,
          authenticatedAt: accountHelper.getCurrentTime()
        }
      }
    )
  }
}
