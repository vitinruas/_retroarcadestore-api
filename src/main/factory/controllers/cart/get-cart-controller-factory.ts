import { IController } from '../../../../presentation/protocols'
import { GetCartController } from '../../../../presentation/controllers/cart/get/get-cart-controller'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeGetCartUseCaseFactory } from '../../usecases/cart/get/get-cart-usecase-factory'

export const makeGetCartControllerFactory = (): IController => {
  const getCartController = makeLogControllerDecoratorFactory(
    new GetCartController(makeGetCartUseCaseFactory())
  )
  return getCartController
}
