import { LengthFieldError } from '../validations-errors'
import { LengthFieldValidation } from './length-field-validation'

const makeSut = (): LengthFieldValidation => {
  return new LengthFieldValidation('field', 8, 12)
}

describe('LengthFieldValidation', () => {
  test('should return an error if the field value does not have minimum number of characters', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'small' })

    expect(error).toEqual(new LengthFieldError('field', 8))
  })

  test('should return an error if the field value pass maximum number of characters', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'small' })

    expect(error).toEqual(new LengthFieldError('field', 8, 12))
  })

  test('should not return anything if field length is valid', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'valid_length' })

    expect(error).toBeFalsy()
  })
})
