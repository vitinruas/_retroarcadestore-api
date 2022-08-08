import { IValidation } from '../login-validation-factory-protocols'
import { ValidatorAdapter } from '../../../../../../../infra/validator/validator-adapter'
import { ValidationComposite } from '../../../../../../../validation/validation-composite'
import {
  EmailValidation,
  RequiredFieldValidation
} from '../../../../../../../validation/validations'
import { makeLoginValidationFactory } from '../login-validation-factory'

jest.mock('../../../../../../../validation/validation-composite')
describe('LoginValidationFactory', () => {
  test('should call ValidationComposite with Login validations', () => {
    makeLoginValidationFactory()
    const validations: IValidation[] = []
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field))
    }
    validations.push(new EmailValidation('email', new ValidatorAdapter()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
