import { LoginController } from '../../../../../presentation/controllers/account/authentication/login/login-controller'
import { IController } from '../../../../../presentation/protocols/controller-protocol'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { makeAuthenticationUseCaseFactory } from '../../../usecases/account/authentication/authentication-usecase-factory'
import { makeLoginValidationFactory } from '../../../validations/account/authentication/login/login-validation-factory'

export const makeLoginControllerFactory = (): IController => {
  const loginController = makeLogControllerDecoratorFactory(
    new LoginController(
      makeLoginValidationFactory(),
      makeAuthenticationUseCaseFactory()
    )
  )
  return loginController
}
