import { IValidation } from './login-validation-factory-protocols'
import { ValidatorAdapter } from '../../../../../../utils/validator/validator-adapter'
import { ValidationComposite } from '../../../../../../validation/validation-composite'
import {
  EmailValidation,
  RequiredFieldValidation
} from '../../../../../../validation/validations'

export const makeLoginValidationFactory = () => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new ValidatorAdapter()))
  return new ValidationComposite(validations)
}
