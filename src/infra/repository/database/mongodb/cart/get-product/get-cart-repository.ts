import {
  ICartEntitie,
  IGetCartRepository
} from '../../../../../../usecases/cart/get/get-cart-usecase-protocols'
import mongoHelper from '../../helpers/mongo-helper'

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
