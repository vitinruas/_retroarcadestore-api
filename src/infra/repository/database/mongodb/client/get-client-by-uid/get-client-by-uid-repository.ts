import {
  IGetClientModel,
  IGetClientByUIDRepository
} from './get-client-by-uid-repository-protocols'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'
import { IAddress } from '../../../../../../domain/entities/account/client-entitie'

export class GetClientByUIDRepository implements IGetClientByUIDRepository {
  async get(uid: string): Promise<IGetClientModel> {
    // client
    const clientsCollectionRef = mongoose.connection.collection('accounts')
    const client = await clientsCollectionRef.findOne({
      _id: new mongoose.Types.ObjectId(uid)
    })
    delete client!.password
    delete client!.accessToken

    // address
    const addressesCollectionRef = mongoose.connection.collection('addresses')
    const address = await addressesCollectionRef.findOne({
      uid: new mongoose.Types.ObjectId(uid)
    })

    const clientEntitie: IGetClientModel = mongoHelper.replaceMongoID(
      client,
      'uid'
    )
    const addressEntitie: IAddress = mongoHelper.replaceMongoID(address, 'aid')

    const clientModel: IGetClientModel = {
      ...clientEntitie,
      address: {
        ...addressEntitie
      }
    }
    return clientModel
  }
}
