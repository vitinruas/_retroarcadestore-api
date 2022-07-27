import { UpdateClientController } from '../../../../presentation/controllers/client/update/update-client-controller'
import { EmailValidatorAdapter } from '../../../../utils/email-validator/email-validator-adapter'
import { makeUpdateClientUseCase } from '../../usecases/client/update-client/update-client-usecase-factory'

export const makeUpdateClientController = (): UpdateClientController => {
  const emailValidator = new EmailValidatorAdapter()
  const updateClientController = new UpdateClientController(
    emailValidator,
    makeUpdateClientUseCase()
  )
  return updateClientController
}
