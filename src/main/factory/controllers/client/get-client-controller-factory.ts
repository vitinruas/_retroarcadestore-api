import { GetClientController } from '../../../../presentation/controllers/client/get/get-client-controller'
import { makeGetClientFactory } from '../../usecases/client/get-client/get-client-usecase-factory'

export const makeGetClientControllerFactory = (): GetClientController => {
  const getClientController = new GetClientController(makeGetClientFactory())
  return getClientController
}
