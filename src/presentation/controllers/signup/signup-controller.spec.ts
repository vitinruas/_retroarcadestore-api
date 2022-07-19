import { InvalidFieldError } from '../../errors/invalid-field-error'
import { MissingFieldError } from '../../errors/missing-field-error'
import { IEmailValidator } from '../../protocols/email-validator-protocol'
import { IHttpRequest, IHttpResponse } from '../../protocols/http-protocol'
import { SignUpController } from './signup-controller'
import {
  badRequest,
  forbidden,
  serverError
} from '../../helpers/http-response-helper'
import {
  IAddAccountModel,
  IAddAccountUseCase
} from 'src/domain/usecases/account/add-account-usecase'

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

const makeAddAccountUseCaseStub = (): IAddAccountUseCase => {
  class AddAccountUseCaseStub implements IAddAccountUseCase {
    add(newAccountData: IAddAccountModel): Promise<string | null> {
      return Promise.resolve('any_token')
    }
  }
  return new AddAccountUseCaseStub()
}

interface ISut {
  sut: SignUpController
  emailValidatorStub: IEmailValidator
  addAccountUseCase: IAddAccountUseCase
}

const makeSut = (): ISut => {
  const emailValidatorStub: IEmailValidator = makeEmailValidatorStub()
  const addAccountUseCase: IAddAccountUseCase = makeAddAccountUseCaseStub()
  const sut: SignUpController = new SignUpController(
    emailValidatorStub,
    addAccountUseCase
  )
  return {
    sut,
    emailValidatorStub,
    addAccountUseCase
  }
}

describe('SignUpController', () => {
  test('should return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('name')))
  })

  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(badRequest(new MissingFieldError('password')))
  })

  test('should return 400 if no passwordConfirmation is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(
      badRequest(new MissingFieldError('passwordConfirmation'))
    )
  })

  test('should return 400 if passwords do not match', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(
      badRequest(new InvalidFieldError('passwordConfirmation'))
    )
  })

  test('should call EmailValidator with an email', async () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(emailValidatorStub, 'validate')
    await sut.perform(makeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResponse: IHttpResponse = await sut.perform(makeValidRequest())

    expect(httpResponse).toEqual(serverError())
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emailValidatorStub }: ISut = makeSut()
    jest.spyOn(emailValidatorStub, 'validate').mockReturnValueOnce(false)

    const httpResponse: IHttpResponse = await sut.perform(makeValidRequest())

    expect(httpResponse).toEqual(badRequest(new InvalidFieldError('email')))
  })

  test('should call AddAccountUseCase with correct values', async () => {
    const { sut, addAccountUseCase }: ISut = makeSut()
    const addSpy = jest.spyOn(addAccountUseCase, 'add')

    await sut.perform(makeValidRequest())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('should return 500 if AddAccountUseCase throws', async () => {
    const { sut, addAccountUseCase }: ISut = makeSut()
    jest
      .spyOn(addAccountUseCase, 'add')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const response: IHttpResponse = await sut.perform(makeValidRequest())

    expect(response).toEqual(serverError())
  })

  test('should return 403 if AddAccountUseCase fails', async () => {
    const { sut, addAccountUseCase }: ISut = makeSut()
    jest
      .spyOn(addAccountUseCase, 'add')
      .mockReturnValueOnce(Promise.resolve(null))

    const response: IHttpResponse = await sut.perform(makeValidRequest())

    expect(response).toEqual(forbidden('Email already in use'))
  })
})
