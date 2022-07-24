import { IGetClientByUIDRepository } from '../../../../../../usecases/protocols/repository/client/get-client-by-uid-repository-protocol'
import { IGetClientModel } from '../../../../../../domain/usecases/client/get-client-usecase'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'

export class GetClientByUIDRepository implements IGetClientByUIDRepository {
  async get(uid: string): Promise<IGetClientModel> {
    const collectionRef = mongoose.connection.collection('accounts')
    const document = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(uid)
    })
    delete document!.password
    delete document!.accessToken
    return mongoHelper.replaceMongoID(document)
  }
}
