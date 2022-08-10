import { IAddCartProductUseCase } from '../../../domain/usecases/cart/add-cart-product-usecase'
import { IGetProductRepository } from '../../product/get-product/get-product-usecase-protocols'

export class AddCartProductUseCase implements IAddCartProductUseCase {
  constructor(private readonly getProductRepository: IGetProductRepository) {}
  async add(uid: string, pid: string): Promise<boolean> {
    await this.getProductRepository.get(pid)
    return Promise.resolve(true)
  }
}
