import { LoginController } from '../../../../presentation/controllers/account/authentication/login/login-controller'
import { IController } from '../../../../presentation/protocols/controller-protocol'
import { EmailValidatorAdapter } from '../../../../utils/email-validator/email-validator-adapter'
import { makeAuthenticationUseCaseFactory } from '../../usecases/account/authentication/authentication-usecase-factory'

export const makeLoginControllerFactory = (): IController => {
  const loginController = new LoginController(
    new EmailValidatorAdapter(),
    makeAuthenticationUseCaseFactory()
  )
  return loginController
}
