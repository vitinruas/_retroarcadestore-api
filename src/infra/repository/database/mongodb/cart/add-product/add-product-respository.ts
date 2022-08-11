import mongoose from 'mongoose'
import { IAddCartProductRepository } from '../../../../../../usecases/protocols/repository/cart/add-cart-product-repository'
import mongoHelper from '../../helpers/mongo-helper'

export class AddCartProductRepository implements IAddCartProductRepository {
  async add(uid: string, pid: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('carts')

    const clientCartDocument = await collectionRef.findOne({
      uid: new mongoose.Types.ObjectId(uid)
    })

    const newCartProduct = {
      pid: new mongoose.Types.ObjectId(pid),
      quantity: 0
    }

    await collectionRef.updateOne(
      { uid: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          uid: new mongoose.Types.ObjectId(uid),
          products: clientCartDocument
            ? [...clientCartDocument!.products, newCartProduct]
            : [newCartProduct]
        }
      },
      { upsert: true }
    )
  }
}
