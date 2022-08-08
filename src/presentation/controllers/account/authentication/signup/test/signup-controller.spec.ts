import { SignUpController } from '../signup-controller'
import { FieldAlreadyUse } from '../../../../../errors'
import {
  badRequest,
  forbidden,
  ok,
  serverError
} from '../../../../../helpers/http-response-helper'
import {
  IAddAccountModel,
  IAddAccountUseCase,
  IHttpRequest,
  IHttpResponse,
  IValidation
} from '../signup-controller-protocols'

const makeFakeValidRequest = (): IHttpRequest => ({
  headers: 'any_headers',
  ip: 'any_ip',
  route: 'any_route',
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeValidationCompositeStub = (): IValidation => {
  class ValidationCompositeStub implements IValidation {
    async validate(fields: any): Promise<void | Error> {
      return Promise.resolve()
    }
  }
  return new ValidationCompositeStub()
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
  validationCompositeStub: IValidation
  addAccountUseCase: IAddAccountUseCase
}

const makeSut = (): ISut => {
  const validationCompositeStub: IValidation = makeValidationCompositeStub()
  const addAccountUseCase: IAddAccountUseCase = makeAddAccountUseCaseStub()
  const sut: SignUpController = new SignUpController(
    validationCompositeStub,
    addAccountUseCase
  )
  return {
    sut,
    validationCompositeStub,
    addAccountUseCase
  }
}

describe('SignUpController', () => {
  test('should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    const httpRequest: IHttpRequest = makeFakeValidRequest()

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 400 if ValidationComposite fails', async () => {
    const { sut, validationCompositeStub }: ISut = makeSut()
    jest
      .spyOn(validationCompositeStub, 'validate')
      .mockReturnValue(Promise.resolve(new Error()))

    const httpResponse: IHttpResponse = await sut.perform(
      makeFakeValidRequest()
    )

    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('should call AddAccountUseCase with correct values', async () => {
    const { sut, addAccountUseCase }: ISut = makeSut()
    const addSpy = jest.spyOn(addAccountUseCase, 'add')

    await sut.perform(makeFakeValidRequest())

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

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 403 if AddAccountUseCase fails', async () => {
    const { sut, addAccountUseCase }: ISut = makeSut()
    jest
      .spyOn(addAccountUseCase, 'add')
      .mockReturnValueOnce(Promise.resolve(null))

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(forbidden(new FieldAlreadyUse('email')))
  })

  test('should return access token if AddAccountUseCase succeeds', async () => {
    const { sut }: ISut = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(ok({ accessToken: 'any_token' }))
  })
})
