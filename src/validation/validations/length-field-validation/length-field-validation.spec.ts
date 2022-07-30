import { InvalidFieldError } from '../validations-errors'
import { LengthFieldValidation } from './length-field-validation'

const makeSut = (): LengthFieldValidation => {
  return new LengthFieldValidation('field', 8, 12)
}

describe('LengthFieldValidation', () => {
  // return an error if field length is invalid
  it('should return an error if field length is invalid', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'small' })

    expect(error).toEqual(new InvalidFieldError('field'))
  })

  // not return anything if field length is valid
  it('should not return anything if field length is valid', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'valid_length' })

    expect(error).toBeFalsy()
  })
})
