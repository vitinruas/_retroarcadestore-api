import { SignUpController } from '../../../../../presentation/controllers/account/authentication/signup/signup-controller'
import { IController } from '../../../../../presentation/protocols/controller-protocol'
import { makeLogControllerDecoratorFactory } from '../../../decorators/log-controller-decorator-factory'
import { makeAddAccountUseCaseFactory } from '../../../usecases/account/add-account/add-account-usecase-factory'
import { makeSignUpValidationFactory } from '../../../validations/account/authentication/signup/signup-validation-factory'

export const makeSignUpControllerFactory = (): IController => {
  const signUpController = makeLogControllerDecoratorFactory(
    new SignUpController(
      makeSignUpValidationFactory(),
      makeAddAccountUseCaseFactory()
    )
  )
  return signUpController
}
