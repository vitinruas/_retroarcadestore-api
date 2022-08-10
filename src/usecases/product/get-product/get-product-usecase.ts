import {
  IProductEntitie,
  IGetProductUseCase,
  IGetProductRepository
} from './get-product-usecase-protocols'

export class GetProductUseCase implements IGetProductUseCase {
  constructor(private readonly getProductsRepository: IGetProductRepository) {}
  async get(pid: string): Promise<IProductEntitie | null> {
    return await this.getProductsRepository.get(pid)
  }
}
