import { IController } from '../../../../presentation/protocols'
import { GetProductController } from '../../../../presentation/controllers/products/get/get-product-controller'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeGetProductUseCaseFactory } from '../../usecases/product/get-product/get-product-usecase-factory'

export const makeGetProductControllerFactory = (): IController => {
  const getProductController = makeLogControllerDecoratorFactory(
    new GetProductController(makeGetProductUseCaseFactory())
  )
  return getProductController
}
