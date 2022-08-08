import { IValidation } from './signup-validation-factory-protocols'
import { ValidatorAdapter } from '../../../../../../utils/validator/validator-adapter'
import { ValidationComposite } from '../../../../../../validation/validation-composite'
import {
  CompareFieldsValidation,
  EmailValidation,
  LengthFieldValidation,
  RequiredFieldValidation
} from '../../../../../../validation/validations'

export const makeSignUpValidationFactory = () => {
  const validations: IValidation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field))
  }
  validations.push(new EmailValidation('email', new ValidatorAdapter()))
  validations.push(new LengthFieldValidation('name', 3, 32))
  validations.push(new LengthFieldValidation('password', 8))
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  )
  return new ValidationComposite(validations)
}
