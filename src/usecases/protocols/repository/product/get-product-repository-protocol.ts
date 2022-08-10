import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'

export interface IGetProductRepository {
  get(id?: string): Promise<IProductEntitie | null>
}
