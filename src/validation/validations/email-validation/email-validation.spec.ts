import { InvalidFieldError } from '../validations-errors'
import { IEmailValidatorAdapter, IValidation } from '../validations-protocols'
import { EmailValidation } from './email-validation'

const makeFakeValidInput = () => ({
  email: 'any_email@mail.com'
})

// EmailValidatorAdapter, user's email will be validated
// and it'll returned a boolean response
const makeEmailValidatorStub = (): IEmailValidatorAdapter => {
  class EmailValidatorStub implements IEmailValidatorAdapter {
    validateEmail(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface ISut {
  sut: IValidation
  emailValidator: IEmailValidatorAdapter
}

const makeSut = (): ISut => {
  const emailValidator: IEmailValidatorAdapter = makeEmailValidatorStub()
  const sut: IValidation = new EmailValidation('email', emailValidator)
  return {
    sut,
    emailValidator
  }
}

describe('EmailValidation', () => {
  // calls EmailValidator.validate with correct values
  test('should calls Email Validator with correct values', () => {
    const { sut, emailValidator }: ISut = makeSut()
    const validateSpy = jest.spyOn(emailValidator, 'validateEmail')

    sut.validate(makeFakeValidInput())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return throw if EmailValidator throws', () => {
    const { sut, emailValidator }: ISut = makeSut()
    jest.spyOn(emailValidator, 'validateEmail').mockImplementationOnce(() => {
      throw new Error()
    })

    expect(sut.validate).toThrow()
  })

  test('should return a 422 error code if invalid email is provided', () => {
    const { sut, emailValidator }: ISut = makeSut()

    jest.spyOn(emailValidator, 'validateEmail').mockReturnValueOnce(false)

    const error: Promise<Error | void> = sut.validate(makeFakeValidInput())

    expect(error).toEqual(new InvalidFieldError('email'))
  })
})
