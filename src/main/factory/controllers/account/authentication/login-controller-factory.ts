import { LoginController } from '../../../../../presentation/controllers/account/authentication/login/login-controller'
import { IController } from '../../../../../presentation/protocols/controller-protocol'
import { makeAuthenticationUseCaseFactory } from '../../../usecases/account/authentication/authentication-usecase-factory'
import { makeLoginValidationFactory } from '../../../validations/login/login-validation-factory'

export const makeLoginControllerFactory = (): IController => {
  const loginController = new LoginController(
    makeLoginValidationFactory(),
    makeAuthenticationUseCaseFactory()
  )
  return loginController
}
