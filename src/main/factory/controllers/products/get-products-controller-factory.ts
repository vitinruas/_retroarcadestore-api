import { GetProductsController } from '../../../../presentation/controllers/products/get-all/get-products-controller'
import { IController } from '../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeGetProductsUseCaseFactory } from '../../usecases/product/get-products/get-products-usecase-factory'

export const makeGetProductsControllerFactory = (): IController => {
  const getProductsController = makeLogControllerDecoratorFactory(
    new GetProductsController(makeGetProductsUseCaseFactory())
  )
  return getProductsController
}
