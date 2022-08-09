import { IProductEntitie } from '../../entities/product/product-entitie'

export interface IGetProductsUseCase {
  get(): Promise<IProductEntitie[] | null>
}
