import { UpdateClientController } from '../../../../presentation/controllers/client/update/update-client-controller'
import { makeUpdateClientUseCase } from '../../usecases/client/update-client/update-client-usecase-factory'
import { makeUpdateClientValidationFactory } from '../../validations/client/update/update-client-validation-factory'

export const makeUpdateClientController = (): UpdateClientController => {
  const updateClientController = new UpdateClientController(
    makeUpdateClientValidationFactory(),
    makeUpdateClientUseCase()
  )
  return updateClientController
}
