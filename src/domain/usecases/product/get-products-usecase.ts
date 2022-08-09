import { IProductEntitie } from '../../entities/product/product-entitie'

export interface IGetProductsUseCase {
  get(pid?: string): Promise<IProductEntitie | IProductEntitie[] | null>
}
