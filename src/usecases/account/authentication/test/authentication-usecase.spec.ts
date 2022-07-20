import { IAuthenticationModel } from '../../../../domain/usecases/account/authentication-usecase'
import { IHashComparer } from '../../../protocols/cryptography/hash-comparer-protocol'
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
      return Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'hashed_password'
      })
    }
  }
  return new GetAccountByEmailRepositoryStub()
}

const makePasswordHashComparerStub = () => {
  class PasswordHashComparerStub implements IHashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new PasswordHashComparerStub()
}

interface ISut {
  sut: AuthenticationUseCase
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
  passwordHashComparer: IHashComparer
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub: IGetAccountByEmailRepository =
    makeGetAccountByEmailRepositoryStub()
  const passwordHashComparer: IHashComparer = makePasswordHashComparerStub()
  const sut: AuthenticationUseCase = new AuthenticationUseCase(
    getAccountByEmailRepositoryStub,
    passwordHashComparer
  )
  return {
    sut,
    getAccountByEmailRepositoryStub,
    passwordHashComparer
  }
}

describe('AuthenticationUseCase', () => {
  test('should call GetAccountByEmailRepository with an email', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByEmailRepositoryStub, 'get')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(getSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return throw if GetAccountByEmailRepository throws', async () => {
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

  test('should returns null if GetAccountByEmailRepository fails', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'get')
      .mockReturnValueOnce(Promise.resolve(null))

    const accessToken = await sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    expect(accessToken).toBeNull()
  })

  test('should call PasswordHashComparer with correct values', async () => {
    const { sut, passwordHashComparer } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparer, 'compare')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return throw if PasswordHashComparer throws', async () => {
    const { sut, passwordHashComparer } = makeSut()
    jest
      .spyOn(passwordHashComparer, 'compare')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<string | null> = sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    await expect(promise).rejects.toThrow()
  })

  test('should return null if PasswordHashComparer fails', async () => {
    const { sut, passwordHashComparer } = makeSut()
    jest
      .spyOn(passwordHashComparer, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    expect(accessToken).toBeNull()
  })
})
