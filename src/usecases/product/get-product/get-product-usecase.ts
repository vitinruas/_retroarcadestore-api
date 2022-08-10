import { IProductEntitie } from '../../../domain/entities/product/product-entitie'
import { IGetProductUseCase } from '../../../domain/usecases/product/get-product-usecase'
import { IGetProductRepository } from '../../protocols/repository/product/get-product-repository-protocol'

export class GetProductUseCase implements IGetProductUseCase {
  constructor(private readonly getProductsRepository: IGetProductRepository) {}
  async get(pid: string): Promise<IProductEntitie | null> {
    return await this.getProductsRepository.get(pid)
  }
}
