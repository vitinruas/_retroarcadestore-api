import mongoose from 'mongoose'
import {
  IAccountEntitie,
  IGetAccountByEmailRepository
} from 'src/usecases/account/add-account-protocols'

export class GetAccountByEmailMongoRepository
  implements IGetAccountByEmailRepository
{
  async get(email: string): Promise<IAccountEntitie | null> {
    const collectionRef = mongoose.connection.collection('accounts')
    const document = await collectionRef.findOne({ email })
    const { _id, ...data }: any = document
    const account = Object.assign({}, data, { id: _id })

    return account || null
  }
}
