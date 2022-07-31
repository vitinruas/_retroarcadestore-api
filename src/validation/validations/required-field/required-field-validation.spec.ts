import { MissingFieldError } from '../validations-errors'
import { RequiredFieldValidation } from './required-field-validation'

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field')
}

describe('RequiredFieldValidation', () => {
  test("should return an error if required field wasn't provided ", () => {
    const sut = makeSut()

    const error = sut.validate({ otherfield: 'any_value' })

    expect(error).toEqual(new MissingFieldError('field'))
  })

  test('should not return anything if required field was provided', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toBeFalsy()
  })
})
