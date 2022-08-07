import { UpdateClientController } from '../../../../presentation/controllers/client/update/update-client-controller'
import { IController } from '../../../../presentation/protocols'
import { makeLogControllerDecoratorFactory } from '../../decorators/log-controller-decorator-factory'
import { makeUpdateClientUseCase } from '../../usecases/client/update-client/update-client-usecase-factory'
import { makeUpdateClientValidationFactory } from '../../validations/client/update/update-client-validation-factory'

export const makeUpdateClientController = (): IController => {
  const updateClientController = makeLogControllerDecoratorFactory(
    new UpdateClientController(
      makeUpdateClientValidationFactory(),
      makeUpdateClientUseCase()
    )
  )
  return updateClientController
}
