import { IAddCartProductRepository } from '../../../../../../usecases/protocols/repository/cart/add-cart-product-repository'
import mongoHelper from '../../helpers/mongo-helper'

export class AddCartProductRepository implements IAddCartProductRepository {
  async add(uid: string, pid: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('carts')

    const mongoUID = mongoHelper.createMongoID(uid)
    const mongoPID = mongoHelper.createMongoID(pid)
    const clientCartDocument = await collectionRef.findOne({
      uid: mongoUID
    })

    const newCartProduct = {
      pid: mongoPID,
      quantity: 0
    }

    await collectionRef.updateOne(
      { uid: mongoUID },
      {
        $set: {
          uid: mongoUID,
          products: clientCartDocument
            ? [...clientCartDocument!.products, newCartProduct]
            : [newCartProduct]
        }
      },
      { upsert: true }
    )
  }
}
