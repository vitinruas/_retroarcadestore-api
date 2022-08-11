import { ICartEntitie } from '../../../../domain/entities/cart/cart-entitie'

export interface IGetCartRepository {
  get(pid: string): Promise<ICartEntitie | null>
}
