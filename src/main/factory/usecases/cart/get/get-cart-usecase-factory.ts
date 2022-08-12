import { IGetCartUseCase } from '../../../../../domain/usecases/cart/get-cart-usecase'
import { GetCartRepository } from '../../../../../infra/repository/database/mongodb/cart/get/get-cart-repository'
import { GetCartUseCase } from '../../../../../usecases/cart/get/get-cart-usecase'

export const makeGetCartUseCaseFactory = (): IGetCartUseCase => {
  const getCartRepositroy = new GetCartRepository()
  const getCartUseCase = new GetCartUseCase(getCartRepositroy)
  return getCartUseCase
}
