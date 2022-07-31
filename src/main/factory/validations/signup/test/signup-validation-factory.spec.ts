import { IValidation } from '../signup-validation-factory-protocols'
import { EmailValidatorAdapter } from '../../../../../utils/email-validator/email-validator-adapter'
import { ValidationComposite } from '../../../../../validation/validation-composite'
import {
  CompareFieldsValidation,
  EmailValidation,
  LengthFieldValidation,
  RequiredFieldValidation
} from '../../../../../validation/validations'
import { makeSignUpValidationFactory } from '../signup-validation-factory'

jest.mock('../../../../../validation/validation-composite')
describe('LoginValidationFactory', () => {
  test('should call ValidationComposite with Login validations', () => {
    makeSignUpValidationFactory()
    const validations: IValidation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    )
    validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
    validations.push(new LengthFieldValidation('name', 3, 32))
    validations.push(new LengthFieldValidation('password', 8))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
