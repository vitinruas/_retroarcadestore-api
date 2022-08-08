import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'

export interface IGetProductsRepository {
  get(id?: string): Promise<IProductEntitie | IProductEntitie[] | null>
}
