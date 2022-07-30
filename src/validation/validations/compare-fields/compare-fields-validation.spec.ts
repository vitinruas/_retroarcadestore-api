import { InvalidFieldError } from '../validations-errors'
import { CompareFieldsValidation } from './compare-fields-validation'

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare')
}
describe('CompareFieldsValidation', () => {
  // return an error if fields don't match
  it("should return an error if fields don't match", () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value'
    })

    expect(error).toEqual(new InvalidFieldError('fieldToCompare'))
  })

  // not return anything if fields match
  it('should not return anything if fields match', () => {
    const sut = makeSut()

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value'
    })

    expect(error).toBeFalsy()
  })
})
