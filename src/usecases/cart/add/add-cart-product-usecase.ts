import { IAddCartProductUseCase } from '../../../domain/usecases/cart/add-cart-product-usecase'
import {
  IGetProductRepository,
  IProductEntitie
} from '../../product/get-product/get-product-usecase-protocols'
import { IAddCartProductRepository } from '../../protocols/repository/cart/add-cart-product-repository'

export class AddCartProductUseCase implements IAddCartProductUseCase {
  constructor(
    private readonly getProductRepository: IGetProductRepository,
    private readonly addCartProductRepository: IAddCartProductRepository
  ) {}

  async add(uid: string, pid: string): Promise<boolean> {
    const product: IProductEntitie | null = await this.getProductRepository.get(
      pid
    )
    if (!product) {
      return false
    }
    await this.addCartProductRepository.add(uid, pid)
    return true
  }
}
