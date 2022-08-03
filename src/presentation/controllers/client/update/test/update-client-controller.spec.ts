import { UpdateClientController } from '../update-client-controller'
import {
  badRequest,
  noContent,
  serverError
} from '../../../../helpers/http-response-helper'
import {
  IHttpRequest,
  IUpdateClientUseCase,
  IUpdateClientUseCaseModel,
  IHttpResponse
} from '../update-client-controller-protocols'
import { NoFieldProvidedError, InvalidFieldError } from '../../../../errors'
import { IValidation } from '../../../../protocols'

const makeFakeValidRequest = (
  fieldToDelete?: string | null,
  fieldToEmpty?: string
): IHttpRequest => {
  const request: any = {
    file: {
      filename: 'any_photo'
    },
    body: {
      uid: 'any_uid',
      name: 'any_name',
      birthDay: 'any_date',
      email: 'any_email@mail.com',
      password: 'any_password',
      newPassword: 'any_password',
      newPasswordConfirmation: 'any_password',
      street: 'any_street',
      zipCode: '1123456789',
      district: 'any_district',
      city: 'any_city',
      country: 'any_contry'
    }
  }
  if (fieldToDelete) {
    if (request.body[fieldToDelete]) {
      delete request.body[fieldToDelete]
    } else {
      delete request[fieldToDelete]
    }
    return request
  }

  if (fieldToEmpty) {
    request.body[fieldToEmpty] = ''
  }

  return request
}

const makeValidationCompositeStub = (): IValidation => {
  class ValidationCompositeStub implements IValidation {
    async validate(fields: any): Promise<void | Error> {
      return Promise.resolve()
    }
  }
  return new ValidationCompositeStub()
}

const makeUpdateClientUseCaseStub = (): IUpdateClientUseCase => {
  class UpdateClientUseCaseStub implements IUpdateClientUseCase {
    async update(fields: IUpdateClientUseCaseModel): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new UpdateClientUseCaseStub()
}

interface ISut {
  sut: UpdateClientController
  validationCompositeStub: IValidation
  updateClientUseCaseStub: IUpdateClientUseCase
}

const makeSut = (): ISut => {
  const validationCompositeStub: IValidation = makeValidationCompositeStub()
  const updateClientUseCaseStub: IUpdateClientUseCase =
    makeUpdateClientUseCaseStub()
  const sut: UpdateClientController = new UpdateClientController(
    validationCompositeStub,
    updateClientUseCaseStub
  )
  return {
    sut,
    validationCompositeStub,
    updateClientUseCaseStub
  }
}

describe('UpdateClientController', () => {
  test('should call ValidationComposite with correct values', async () => {
    const { sut, validationCompositeStub }: ISut = makeSut()
    const validateSpy = jest.spyOn(validationCompositeStub, 'validate')
    const httpRequest: IHttpRequest = makeFakeValidRequest()

    await sut.perform(makeFakeValidRequest())

    expect(validateSpy).toHaveBeenCalledWith(
      Object.assign(httpRequest.body, { photo: httpRequest.file.filename })
    )
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

  test('should return 400 if no field is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {
        uid: 'any_id'
      }
    }

    const response: IHttpResponse = await sut.perform(httpRequest)

    expect(response).toEqual(badRequest(new NoFieldProvidedError()))
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

  test('should return 400 if UpdateClientUseCase fails', async () => {
    const { sut, updateClientUseCaseStub } = makeSut()
    jest
      .spyOn(updateClientUseCaseStub, 'update')
      .mockReturnValueOnce(Promise.resolve(false))

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(badRequest(new InvalidFieldError('password')))
  })

  test('should return 204 if UpdateClientUseCase succeeds', async () => {
    const { sut } = makeSut()

    const response: IHttpResponse = await sut.perform(makeFakeValidRequest())

    expect(response).toEqual(noContent())
  })
})
