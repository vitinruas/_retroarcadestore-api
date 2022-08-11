import { AddCartProductController } from '../../../../presentation/controllers/cart/add-cart-product/add-cart-product-controller'
import { IController } from '../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeAddCartProductUseCaseFactory } from '../../usecases/cart/add-cart/get-product-usecase-factory'

export const makeAddCartProductControllerFactory = (): IController => {
  const addCartProductController = makeLogControllerDecoratorFactory(
    new AddCartProductController(makeAddCartProductUseCaseFactory())
  )
  return addCartProductController
}
