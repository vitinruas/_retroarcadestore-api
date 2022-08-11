import { ICartEntitie } from '../../entities/cart/cart-entitie'

export interface IGetCartUseCase {
  get(uid: string): Promise<ICartEntitie | null>
}
