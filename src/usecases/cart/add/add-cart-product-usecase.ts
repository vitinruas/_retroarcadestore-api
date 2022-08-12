import {
  IAddCartProductUseCase,
  IGetProductRepository,
  IAddCartProductRepository,
  IProductEntitie
} from './add-cart-product-usecase-protocols'

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
