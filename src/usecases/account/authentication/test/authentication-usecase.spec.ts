import { IAuthenticationModel } from '../../../../domain/usecases/account/authentication-usecase'
import {
  IAccountEntitie,
  IGetAccountByEmailRepository
} from '../../add-account/add-account-usecase-protocols'
import { AuthenticationUseCase } from '../authentication-usecase'

const makeFakeValidAuthenticationData = (): IAuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeGetAccountByEmailRepositoryStub = () => {
  class GetAccountByEmailRepositoryStub
    implements IGetAccountByEmailRepository
  {
    async get(email: string): Promise<IAccountEntitie | null> {
      return Promise.resolve(null)
    }
  }
  return new GetAccountByEmailRepositoryStub()
}

interface ISut {
  sut: AuthenticationUseCase
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub: IGetAccountByEmailRepository =
    makeGetAccountByEmailRepositoryStub()
  const sut: AuthenticationUseCase = new AuthenticationUseCase(
    getAccountByEmailRepositoryStub
  )
  return {
    sut,
    getAccountByEmailRepositoryStub
  }
}

describe('AuthenticationUseCase', () => {
  test('should calls GetAccountByEmailRepository with an email', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByEmailRepositoryStub, 'get')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(getSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should returns throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'get')
      .mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })

    const promise: Promise<string | null> = sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    await expect(promise).rejects.toThrow()
  })
})
