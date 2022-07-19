import { InvalidFieldError } from '../../errors/invalid-field-error'
import { MissingFieldError } from '../../errors/missing-field-error'
import { IEmailValidator } from '../../protocols/email-validator-protocol'
import { IHttpRequest, IHttpResponse } from '../../protocols/http-protocol'
import { SignUpController } from './signup-controller'
import { badRequest, serverError } from '../../helpers/http-response-helper'

const makeValidRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeEmailValidatorStub = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    validate(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

interface ISut {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
}

const makeSut = (): ISut => {
  const emailValidatorStub: IEmailValidator = makeEmailValidatorStub()
  const sut: SignUpController = new SignUpController(emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('SignUpController', () => {
  test('should return 400 if no name is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('name')))
  })

  test('should return 400 if no email is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('email')))
  })

  test('should return 400 if no password is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('password')))
  })

  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const response: IHttpResponse = sut.perform(request)

    expect(response).toEqual(
      badRequest(new MissingFieldError('passwordConfirmation'))
    )
  })

  test('should return 400 if passwords do not match', () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const response: IHttpResponse = sut.perform(request)

    expect(response).toEqual(
      badRequest(new InvalidFieldError('passwordConfirmation'))
    )
  })

  test('should call EmailValidator with an email', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()

    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    sut.perform(makeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', () => {
    const { sut, emailValidatorStub }: ISut = makeSut()

    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse: IHttpResponse = sut.perform(makeValidRequest())

    expect(httpResponse).toEqual(serverError())
  })
})
