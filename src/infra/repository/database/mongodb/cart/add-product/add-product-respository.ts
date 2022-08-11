import mongoose from 'mongoose'
import { IAddCartProductRepository } from '../../../../../../usecases/protocols/repository/cart/add-cart-product-repository'
import mongoHelper from '../../helpers/mongo-helper'

export class AddCartProductRepository implements IAddCartProductRepository {
  async add(uid: string, pid: string): Promise<void> {
    const collectionRef = mongoHelper.getCollection('carts')

    const clientCart = await collectionRef.findOne({
      uid: new mongoose.Types.ObjectId(uid)
    })

    let products: { pid: any; quantity: number }[] = []

    if (clientCart) {
      products = clientCart!.products
      products.push({
        pid: new mongoose.Types.ObjectId(pid),
        quantity: 0
      })
    } else {
      products.push({
        pid: new mongoose.Types.ObjectId(pid),
        quantity: 0
      })
    }

    await collectionRef.updateOne(
      { uid: new mongoose.Types.ObjectId(uid) },
      {
        $set: {
          uid: new mongoose.Types.ObjectId(uid),
          products
        }
      },
      { upsert: true }
    )
    return Promise.resolve()
  }
}
