import { SignUpController } from '../../../../../presentation/controllers/account/authentication/signup/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller-protocol'
import { EmailValidatorAdapter } from '../../../../../utils/email-validator/email-validator-adapter'
import { makeAddAccountUseCaseFactory } from '../../../usecases/account/add-account/add-account-usecase-factory'

export const makeSignUpControllerFactory = (): IController => {
  const signUpController = new SignUpController(
    new EmailValidatorAdapter(),
    makeAddAccountUseCaseFactory()
  )
  return signUpController
}
