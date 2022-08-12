import mongoHelper from '../../helpers/mongo-helper'
import {
  IGetCartRepository,
  ICartEntitie
} from './get-cart-repository-protocols'

export class GetCartRepository implements IGetCartRepository {
  async get(uid: string): Promise<ICartEntitie | null> {
    const collectionRef = mongoHelper.getCollection('carts')

    const mongoUID = mongoHelper.createMongoID(uid)
    const document = await collectionRef.findOne({
      uid: mongoUID
    })
    return mongoHelper.replaceMongoID(document, 'cid') || null
  }
}
