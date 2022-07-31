import { MissingFieldError } from '../validations-errors'
import { RequiredFieldIfThereisAnother } from './required-field-if-there-is-another-validation'

const makeSut = (): RequiredFieldIfThereisAnother => {
  return new RequiredFieldIfThereisAnother('field', 'otherField')
}

describe('RequiredFieldIfThereisAnother', () => {
  test("should return an error if required field wasn't provided ", () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_value' })

    expect(error).toEqual(new MissingFieldError('otherField'))
  })

  test('should not return anything if required field was provided', () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'any_value',
      otherField: 'other_field'
    })

    expect(error).toBeFalsy()
  })
})
