import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'

export interface IGetProductsRepository {
  get(): Promise<IProductEntitie[] | null>
}
