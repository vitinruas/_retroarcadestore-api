import { IProductEntitie } from '../../entities/product/product-entitie'

export interface IGetProductUseCase {
  get(pid: string): Promise<IProductEntitie | null>
}
