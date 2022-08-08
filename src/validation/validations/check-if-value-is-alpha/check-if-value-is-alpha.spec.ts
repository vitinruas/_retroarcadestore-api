import { IAlphaValidatorValidator } from '../../protocols/alpha-validator-protocol'
import { InvalidFieldError } from '../validations-errors'
import { CheckIfValueIsAlpha } from './check-if-value-is-alpha'

const makeAlphaValidationStub = (): IAlphaValidatorValidator => {
  class AlphaValidationStub implements IAlphaValidatorValidator {
    validateAlpha(value: string): boolean {
      return true
    }
  }
  return new AlphaValidationStub()
}

interface ISut {
  sut: CheckIfValueIsAlpha
  alphaValidationStub: IAlphaValidatorValidator
}

const makeSut = (): ISut => {
  const alphaValidationStub = makeAlphaValidationStub()
  const sut = new CheckIfValueIsAlpha(alphaValidationStub, 'field')
  return {
    sut,
    alphaValidationStub
  }
}

describe('CheckIfValueIsAlpha', () => {
  // calls AlphaValidation with correct values
  test('should calls AlphaValidation with correct values', () => {
    const { sut, alphaValidationStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(alphaValidationStub, 'validateAlpha')

    sut.validate({ field: 'any_value' })

    expect(validateSpy).toHaveBeenCalledWith('any_value')
  })

  test('should return throw if AlphaValidation throws', () => {
    const { sut, alphaValidationStub }: ISut = makeSut()
    jest
      .spyOn(alphaValidationStub, 'validateAlpha')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    expect(sut.validate).toThrow()
  })
  test('should return an error if field is invalid ', () => {
    const { sut, alphaValidationStub } = makeSut()
    jest.spyOn(alphaValidationStub, 'validateAlpha').mockReturnValue(false)

    const error = sut.validate({ field: 'any_string_value' })

    expect(error).toEqual(new InvalidFieldError('field'))
  })

  test('should not return anything if field is valid', () => {
    const { sut } = makeSut()

    const error = sut.validate({ field: 1234 })

    expect(error).toBeFalsy()
  })
})
