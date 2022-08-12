import {
  IGetCartUseCase,
  IGetCartRepository,
  ICartEntitie
} from './get-cart-usecase-protocols'

export class GetCartUseCase implements IGetCartUseCase {
  constructor(private readonly getCartRepository: IGetCartRepository) {}

  async get(uid: string): Promise<ICartEntitie | null> {
    const cart: ICartEntitie | null = await this.getCartRepository.get(uid)
    return cart || null
  }
}
