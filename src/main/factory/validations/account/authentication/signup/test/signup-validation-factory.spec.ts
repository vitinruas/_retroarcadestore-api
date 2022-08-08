import { IValidation } from '../signup-validation-factory-protocols'
import { ValidatorAdapter } from '../../../../../../../utils/validator/validator-adapter'
import { ValidationComposite } from '../../../../../../../validation/validation-composite'
import {
  CompareFieldsValidation,
  EmailValidation,
  LengthFieldValidation,
  RequiredFieldValidation
} from '../../../../../../../validation/validations'
import { makeSignUpValidationFactory } from '../signup-validation-factory'
import { CheckIfValueIsAlpha } from '../../../../../../../validation/validations/check-if-value-is-alpha/check-if-value-is-alpha'

jest.mock('../../../../../../../validation/validation-composite')
describe('SignUpValidationFactory', () => {
  test('should call ValidationComposite with SignUp validations', () => {
    makeSignUpValidationFactory()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new ValidatorAdapter()))
    validations.push(new LengthFieldValidation('name', 3, 32))
    validations.push(new CheckIfValueIsAlpha(new ValidatorAdapter(), 'name'))
    validations.push(new LengthFieldValidation('password', 8))
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
