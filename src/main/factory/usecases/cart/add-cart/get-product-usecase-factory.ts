import { IAddCartProductUseCase } from '../../../../../domain/usecases/cart/add-cart-product-usecase'
import { AddCartProductRepository } from '../../../../../infra/repository/database/mongodb/cart/add-product/add-cart-product-respository'
import { GetProductRepository } from '../../../../../infra/repository/database/mongodb/product/get-product/get-product-repository'
import { AddCartProductUseCase } from '../../../../../usecases/cart/add/add-cart-product-usecase'

export const makeAddCartProductUseCaseFactory = (): IAddCartProductUseCase => {
  const getProductRepository = new GetProductRepository()
  const addCartProductRepository = new AddCartProductRepository()
  const addCartProductUseCase = new AddCartProductUseCase(
    getProductRepository,
    addCartProductRepository
  )
  return addCartProductUseCase
}
