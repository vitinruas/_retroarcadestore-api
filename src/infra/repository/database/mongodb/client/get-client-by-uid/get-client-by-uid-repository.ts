import {
  IGetClientModel,
  IGetClientByUIDRepository
} from './get-client-by-uid-repository-protocols'
import mongoHelper from '../../helpers/mongo-helper'
import { IAddress } from '../../../../../../domain/entities/account/client-entitie'

export class GetClientByUIDRepository implements IGetClientByUIDRepository {
  async get(uid: string): Promise<IGetClientModel> {
    // client
    const clientsCollectionRef = mongoHelper.getCollection('accounts')
    const client = await clientsCollectionRef.findOne({
      _id: mongoHelper.createMongoID(uid)
    })
    delete client!.password
    delete client!.accessToken

    // address
    const addressesCollectionRef = mongoHelper.getCollection('addresses')
    const address = await addressesCollectionRef.findOne({
      uid: mongoHelper.createMongoID(uid)
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
