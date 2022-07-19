import mongoose from 'mongoose'
import { IUpdateAccountAccessToken } from 'src/usecases/account/add-account-protocols'
import mongoHelper from '../../helpers/mongo-helper'

export class UpdateAccountAccessToken implements IUpdateAccountAccessToken {
  private getDate() {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  async updateToken(id: string, accessToken: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('accounts')
    await collectionRef.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(id) },
      {
        $set: {
          accessToken,
          authenticatedAt: this.getDate()
        }
      }
    )
  }
}
