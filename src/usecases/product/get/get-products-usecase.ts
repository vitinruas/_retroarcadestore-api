import { IProductEntitie } from '../../../domain/entities/product/product-entitie'
import { IGetProductsUseCase } from '../../../domain/usecases/product/get-products-usecase'
import { IGetProductsRepository } from '../../protocols/repository/product/get-products-repository-protocol'

export class GetProductsUseCase implements IGetProductsUseCase {
  constructor(private readonly getProductsRepository: IGetProductsRepository) {}
  async get(
    pid?: string | undefined
  ): Promise<IProductEntitie | IProductEntitie[] | null> {
    if (pid) {
      return await this.getProductsRepository.get(pid)
    }
    return await this.getProductsRepository.get()
  }
}
