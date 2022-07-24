import { IGetClientByUIDRepository } from '../../../../../../usecases/protocols/repository/client/get-client-by-uid-repository-protocol'
import { IClientEntitie } from '../../../../../../domain/entities/account/client-entitie'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'

export class GetClientByUIDRepository implements IGetClientByUIDRepository {
  async get(uid: string): Promise<IClientEntitie> {
    const collectionRef = mongoose.connection.collection('accounts')
    const document = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(uid)
    })

    return mongoHelper.replaceMongoID(document)
  }
}
