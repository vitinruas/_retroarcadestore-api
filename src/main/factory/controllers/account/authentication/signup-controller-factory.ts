import { SignUpController } from '../../../../../presentation/controllers/account/authentication/signup/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller-protocol'
import { makeAddAccountUseCaseFactory } from '../../../usecases/account/add-account/add-account-usecase-factory'
import { makeSignUpValidationFactory } from '../../../validations/signup/signup-validation-factory'

export const makeSignUpControllerFactory = (): IController => {
  const signUpController = new SignUpController(
    makeSignUpValidationFactory(),
    makeAddAccountUseCaseFactory()
  )
  return signUpController
}
