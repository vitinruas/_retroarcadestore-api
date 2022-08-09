import { IProductEntitie } from '../../../../../../domain/entities/product/product-entitie'
import { IGetProductsRepository } from '../../../../../../usecases/protocols/repository/product/get-products-repository-protocol'
import mongoHelper from '../../helpers/mongo-helper'

export class GetProductsRepository implements IGetProductsRepository {
  async get(): Promise<IProductEntitie[] | null> {
    const collectionRef = mongoHelper.getCollection('products')
    // all products
    const documents = await collectionRef.find({}).toArray()
    if (documents) {
      const products: unknown = documents.map((document) => {
        return mongoHelper.replaceMongoID(document, 'pid')
      })
      return products as IProductEntitie[]
    }
    return null
  }
}
