import { IProductEntitie } from '../../entities/product/product-entitie'

export interface IGetProductsUseCase {
  get(id?: string): Promise<IProductEntitie | IProductEntitie[]>
}
