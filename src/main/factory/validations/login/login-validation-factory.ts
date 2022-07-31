import { IValidation } from './login-validation-factory-protocols'
import { EmailValidatorAdapter } from '../../../../utils/email-validator/email-validator-adapter'
import { ValidationComposite } from '../../../../validation/validation-composite'
import {
  EmailValidation,
  RequiredFieldValidation
} from '../../../../validation/validations'

export const makeLoginValidationFactory = () => {
  const validations: IValidation[] = []
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations)
}
