import { IProductEntitie } from '../../../../../../domain/entities/product/product-entitie'
import { IGetProductRepository } from '../../../../../../usecases/protocols/repository/product/get-product-repository-protocol'
import mongoose from 'mongoose'
import mongoHelper from '../../helpers/mongo-helper'

export class GetProductRepository implements IGetProductRepository {
  async get(pid: string): Promise<IProductEntitie | null> {
    const collectionRef = mongoHelper.getCollection('products')
    // only product
    const document = await collectionRef.findOne({
      _id: new mongoose.Types.ObjectId(pid)
    })
    return mongoHelper.replaceMongoID(document, 'pid') || null
  }
}
