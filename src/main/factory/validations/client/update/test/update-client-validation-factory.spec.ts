import { IValidation } from '../update-client-validation-factory-protocols'
import { EmailValidatorAdapter } from '../../../../../../utils/email-validator/email-validator-adapter'
import { ValidationComposite } from '../../../../../../validation/validation-composite'
import {
  CompareFieldsValidation,
  EmailValidation,
  LengthFieldValidation
} from '../../../../../../validation/validations'
import { makeUpdateClientValidationFactory } from '../update-client-validation-factory'
import { RequiredFieldIfThereisAnother } from '../../../../../../validation/validations/required-field-if-there-is-another/required-field-if-there-is-another-validation'
import { TypeCheckValidation } from '../../../../../../validation/validations/type-check/type-check-validation'

jest.mock('../../../../../../validation/validation-composite')
describe('UpdateClientValidationFactory', () => {
  test('should call ValidationComposite with UpdateClient validations', () => {
    makeUpdateClientValidationFactory()
    const validations: IValidation[] = []

    validations.push(new LengthFieldValidation('name', 3, 32))
    validations.push(new RequiredFieldIfThereisAnother('email', 'password'))
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(
      new RequiredFieldIfThereisAnother(
        'newPasswordConfirmation',
        'newPassword'
      )
    )
    validations.push(new LengthFieldValidation('newPassword', 8))
    validations.push(
      new RequiredFieldIfThereisAnother('newPassword', 'password')
    )
    validations.push(
      new CompareFieldsValidation('newPassword', 'newPasswordConfirmation')
    )
    validations.push(new LengthFieldValidation('postalCode', 5, 10))
    validations.push(new TypeCheckValidation('postalCode', 'number'))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
