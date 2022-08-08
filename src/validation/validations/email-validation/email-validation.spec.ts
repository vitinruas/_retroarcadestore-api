import { InvalidFieldError } from '../validations-errors'
import { IValidatorAdapter, IValidation } from '../validations-protocols'
import { EmailValidation } from './email-validation'

const makeFakeValidInput = () => ({
  email: 'any_email@mail.com'
})

// ValidatorAdapter, user's email will be validated
// and it'll returned a boolean response
const makeValidatorAdapterStub = (): IValidatorAdapter => {
  class ValidatorAdapterStub implements IValidatorAdapter {
    validateEmail(email: string): boolean {
      return true
    }
  }
  return new ValidatorAdapterStub()
}

interface ISut {
  sut: IValidation
  ValidatorAdapter: IValidatorAdapter
}

const makeSut = (): ISut => {
  const ValidatorAdapter: IValidatorAdapter = makeValidatorAdapterStub()
  const sut: IValidation = new EmailValidation('email', ValidatorAdapter)
  return {
    sut,
    ValidatorAdapter
  }
}

describe('EmailValidation', () => {
  // calls ValidatorAdapter.validate with correct values
  test('should calls Email Validator with correct values', () => {
    const { sut, ValidatorAdapter }: ISut = makeSut()
    const validateSpy = jest.spyOn(ValidatorAdapter, 'validateEmail')

    sut.validate(makeFakeValidInput())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return throw if ValidatorAdapter throws', () => {
    const { sut, ValidatorAdapter }: ISut = makeSut()
    jest.spyOn(ValidatorAdapter, 'validateEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('should return a 422 error code if invalid email is provided', () => {
    const { sut, ValidatorAdapter }: ISut = makeSut()

    jest.spyOn(ValidatorAdapter, 'validateEmail').mockReturnValueOnce(false)

    const error: Promise<Error | void> = sut.validate(makeFakeValidInput())

    expect(error).toEqual(new InvalidFieldError('email'))
  })
})
