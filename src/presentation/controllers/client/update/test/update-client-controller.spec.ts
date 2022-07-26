import { UpdateClientController } from '../update-client-controller'
import {
  badRequest,
  noContent,
  serverError
} from '../../../../helpers/http-response-helper'
import {
  IEmailValidatorAdapter,
  IHttpRequest,
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel,
  IHttpResponse
} from '../update-client-controller-protocols'
import { NoFieldProvidedError, InvalidFieldError } from '../../../../errors'

const makeFakeValidRequest = (
  fieldToDelete?: string | null,
  fieldToEmpty?: string
): IHttpRequest => {
  const request: IHttpRequest = {
    body: {
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password',
      file: {
        filename: 'any_photo'
      },
      street: 'any_street',
      postalCode: '1123456789',
      complement: 'any_complement',
      district: 'any_district',
      city: 'any_city',
      country: 'any_contry'
    }
  }
  if (fieldToDelete) {
    delete request.body[fieldToDelete]
    return request
  }

  if (fieldToEmpty) {
    request.body[fieldToEmpty] = ''
  }

  return request
}

const makeEmailValidatorAdapterStub = (): IEmailValidatorAdapter => {
  class EmailValidatorAdapterStub implements IEmailValidatorAdapter {
    validate(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

const makeUpdateClientUseCaseStub = (): IUpdateClientUseCase => {
  class UpdateClientUseCaseStub implements IUpdateClientUseCase {
    async update(fields: IUpdateClientUseCaseModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateClientUseCaseStub()
}

interface ISut {
  sut: UpdateClientController
  emailValidatorAdapterStub: IEmailValidatorAdapter
  updateClientUseCaseStub: IUpdateClientUseCase
}

const makeSut = (): ISut => {
  const emailValidatorAdapterStub: IEmailValidatorAdapter =
    makeEmailValidatorAdapterStub()
  const updateClientUseCaseStub: IUpdateClientUseCase =
    makeUpdateClientUseCaseStub()
  const sut: UpdateClientController = new UpdateClientController(
    emailValidatorAdapterStub,
    updateClientUseCaseStub
  )
  return {
    sut,
    emailValidatorAdapterStub,
    updateClientUseCaseStub
  }
}

describe('UpdateClientController', () => {
  test('should return 400 if no field is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {}
    }

    const response: IHttpResponse = await sut.perform(httpRequest)

    expect(response).toEqual(badRequest(new NoFieldProvidedError()))
  })

  test('should call EmailValidatorAdapter with an email', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorAdapterStub, 'validate')

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should call EmailValidatorAdapter with an email', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    const validateSpy = jest.spyOn(emailValidatorAdapterStub, 'validate')

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return 500 if EmailValidatorAdapter throws', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest
      .spyOn(emailValidatorAdapterStub, 'validate')
      .mockImplementationOnce(() => {
        throw new Error()
      })

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 400 if EmailValidatorAdapter fails', async () => {
    const { sut, emailValidatorAdapterStub } = makeSut()
    jest.spyOn(emailValidatorAdapterStub, 'validate').mockReturnValueOnce(false)

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(badRequest(new InvalidFieldError('email')))
  })

  test('should return 400 if an invalid postal code is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        postalCode: 'a123bsds'
      }
    }
    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(badRequest(new InvalidFieldError('postalCode')))
  })

  test('should return 400 if an invalid postal code length is provided', async () => {
    const { sut } = makeSut()
    const request: IHttpRequest = {
      body: {
        postalCode: '123'
      }
    }
    const response: IHttpResponse = await sut.perform(request)

    expect(response).toEqual(badRequest(new InvalidFieldError('postalCode')))
  })

  test('should call UpdateClientUseCase with correct values', async () => {
    const { sut, updateClientUseCaseStub } = makeSut()
    const validateSpy = jest.spyOn(updateClientUseCaseStub, 'update')

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith(
      Object.assign(makeFakeValidRequest().body, { photo: 'any_photo' })
    )
  })

  test('should return 500 if UpdateClientUseCase throws', async () => {
    const { sut, updateClientUseCaseStub } = makeSut()
    jest.spyOn(updateClientUseCaseStub, 'update').mockImplementationOnce(() => {
      throw new Error()
    })

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(serverError(new Error()))
  })

  test('should skip file validation if its is empty', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(
      makeFakeValidRequest(null, 'file')
    )

    expect(response).toEqual(noContent())
  })

  test('should skip file validation if its no provided', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(
      makeFakeValidRequest('file')
    )

    expect(response).toEqual(noContent())
  })

  test('should skip email validation if its is empty', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(
      makeFakeValidRequest(null, 'email')
    )

    expect(response).toEqual(noContent())
  })

  test('should skip email validation if its no provided', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(
      makeFakeValidRequest('email')
    )

    expect(response).toEqual(noContent())
  })

  test('should skip postalCode validation if its no provided', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(
      makeFakeValidRequest('postalCode')
    )

    expect(response).toEqual(noContent())
  })

  test('should return 204 if UpdateClientUseCase succeeds', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })
})
