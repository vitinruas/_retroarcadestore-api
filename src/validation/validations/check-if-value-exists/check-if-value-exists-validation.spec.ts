import { InvalidFieldError } from '../validations-errors'
import { CheckIfValueExistsValidation } from './check-if-value-exists-validation'

const makeSut = (): CheckIfValueExistsValidation => {
  return new CheckIfValueExistsValidation('field', ['A', 'B', 'C'])
}
describe('CheckIfValueExistsValidation', () => {
  test("should return an error if field didn't contains a valid value", () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'Z' })

    expect(error).toEqual(new InvalidFieldError('field'))
  })

  test('should not return anything if field contains a valid value', () => {
    const sut = makeSut()

    const error = sut.validate({ field: 'A' })

    expect(error).toBeFalsy()
  })
})
