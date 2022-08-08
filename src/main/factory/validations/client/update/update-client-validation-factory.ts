import { IValidation } from './update-client-validation-factory-protocols'
import { ValidatorAdapter } from '../../../../../utils/validator/validator-adapter'
import { ValidationComposite } from '../../../../../validation/validation-composite'
import {
  CompareFieldsValidation,
  EmailValidation,
  LengthFieldValidation
} from '../../../../../validation/validations'
import { RequiredFieldIfThereisAnother } from '../../../../../validation/validations/required-field-if-there-is-another/required-field-if-there-is-another-validation'
import { CheckIfValueIsAlpha } from '../../../../../validation/validations/check-if-value-is-alpha/check-if-value-is-alpha'

export const makeUpdateClientValidationFactory = () => {
  const validations: IValidation[] = []

  validations.push(new LengthFieldValidation('name', 3, 32))
  validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'name'))
  validations.push(new RequiredFieldIfThereisAnother('email', 'password'))
  validations.push(new EmailValidation('email', new ValidatorAdapter()))
  validations.push(
    new RequiredFieldIfThereisAnother('newPasswordConfirmation', 'newPassword')
  )
  validations.push(new LengthFieldValidation('newPassword', 8))
  validations.push(new RequiredFieldIfThereisAnother('newPassword', 'password'))
  validations.push(
    new CompareFieldsValidation('newPassword', 'newPasswordConfirmation')
  )
  validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'district'))
  validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'city'))
  validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'state'))
  validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'country'))
  validations.push(new LengthFieldValidation('zipCode', 5, 10))

  return new ValidationComposite(validations)
}
