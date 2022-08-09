import mongoose from 'mongoose'
import { IProductEntitie } from '../../../../../../domain/entities/product/product-entitie'
import { IGetProductsRepository } from '../../../../../../usecases/protocols/repository/product/get-products-repository-protocol'
import mongoHelper from '../../helpers/mongo-helper'

export class GetProductsRepository implements IGetProductsRepository {
  async get(
    pid?: string | undefined
  ): Promise<IProductEntitie | IProductEntitie[] | null> {
    const collectionRef = mongoHelper.getCollection('products')
    // only product
    if (pid) {
      const document = await collectionRef.findOne({
        _id: new mongoose.Types.ObjectId(pid)
      })
      return mongoHelper.replaceMongoID(document, 'pid') || null
    }
    // all products
    const documents = await collectionRef.find({})
    if (documents) {
      const products: unknown = documents.map((document) => {
        return mongoHelper.replaceMongoID(document, 'pid')
      })
      return products as IProductEntitie
    }
    return null
  }
}
