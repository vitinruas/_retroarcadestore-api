import { GetClientController } from '../../../../presentation/controllers/client/get/get-client-controller'
import { IController } from '../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeGetClientFactory } from '../../usecases/client/get-client/get-client-usecase-factory'

export const makeGetClientControllerFactory = (): IController => {
  const getClientController = makeLogControllerDecoratorFactory(
    new GetClientController(makeGetClientFactory())
  )
  return getClientController
}
