import { NoFieldProvidedError } from '../../../../errors/no-field-provided'
import {
  badRequest,
  serverError
} from '../../../../helpers/http-response-helper'
import { IEmailValidatorAdapter } from '../../../../protocols/email-validator-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from '../../get/get-client-controller-protocols'
import { UpdateClientController } from '../update-client-controller'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    photo: 'any_photo',
    street: 'any_street',
    postalCode: 'any_postalcode',
    complement: 'any_complement',
    district: 'any_district',
    city: 'any_city',
    country: 'any_contry'
  }
})

const makeEmailValidatorAdapterStub = (): IEmailValidatorAdapter => {
  class EmailValidatorAdapterStub implements IEmailValidatorAdapter {
    validate(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorAdapterStub()
}

interface ISut {
  sut: UpdateClientController
  emailValidatorAdapterStub: IEmailValidatorAdapter
}

const makeSut = (): ISut => {
  const emailValidatorAdapterStub: IEmailValidatorAdapter =
    makeEmailValidatorAdapterStub()
  const sut: UpdateClientController = new UpdateClientController(
    emailValidatorAdapterStub
  )
  return {
    sut,
    emailValidatorAdapterStub
  }
}

describe('UpdateClientController', () => {
  test('should return 400 if no field is provided', async () => {
    const { sut } = makeSut()
    const httpRequest: IHttpRequest = {
      body: {}
    }

    const httpResponse: IHttpResponse = await sut.perform(httpRequest)

    expect(httpResponse).toEqual(badRequest(new NoFieldProvidedError()))
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

    const response = await sut.perform(makeFakeValidRequest())

    await expect(response).toEqual(serverError(new Error()))
  })
})
