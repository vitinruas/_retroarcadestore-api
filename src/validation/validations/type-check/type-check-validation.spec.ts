import { InvalidFieldError } from '../validations-errors'
import { TypeCheckValidation } from './type-check-validation'

const makeSut = (): TypeCheckValidation => {
  return new TypeCheckValidation('field', 'number')
}

describe('TypeCheckValidation', () => {
  test('should return an error if field type is invalid ', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'any_string_value' })

    expect(error).toEqual(new InvalidFieldError('field'))
  })
})
