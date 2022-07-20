import { IAuthenticationModel } from '../../../../domain/usecases/account/authentication-usecase'
import { IHashComparer } from '../../../protocols/cryptography/hash-comparer-protocol'
import {
  IAccountEntitie,
  IEncrypter,
  IGetAccountByEmailRepository,
  IUpdateAccountAccessToken
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

const makePasswordHashComparerAdapterStub = () => {
  class PasswordHashComparerStub implements IHashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new PasswordHashComparerStub()
}

const makeTokenGeneratorAdapterStub = () => {
  class TokenGeneratorAdapter implements IEncrypter {
    async encrypt(id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorAdapter()
}

const makeUpdateAccountAccessTokenStub = () => {
  class UpdateAccountAccessTokenStub implements IUpdateAccountAccessToken {
    async update(id: string, accessToken: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccountAccessTokenStub()
}

interface ISut {
  sut: AuthenticationUseCase
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
  passwordHashComparerStub: IHashComparer
  tokenGeneratorAdapterStub: IEncrypter
  updateAccountAccessTokenRepositoryStub: IUpdateAccountAccessToken
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub: IGetAccountByEmailRepository =
    makeGetAccountByEmailRepositoryStub()
  const passwordHashComparerStub: IHashComparer =
    makePasswordHashComparerAdapterStub()
  const tokenGeneratorAdapterStub: IEncrypter = makeTokenGeneratorAdapterStub()
  const updateAccountAccessTokenRepositoryStub: IUpdateAccountAccessToken =
    makeUpdateAccountAccessTokenStub()
  const sut: AuthenticationUseCase = new AuthenticationUseCase(
    getAccountByEmailRepositoryStub,
    passwordHashComparerStub,
    tokenGeneratorAdapterStub,
    updateAccountAccessTokenRepositoryStub
  )
  return {
    sut,
    getAccountByEmailRepositoryStub,
    passwordHashComparerStub,
    tokenGeneratorAdapterStub,
    updateAccountAccessTokenRepositoryStub
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
    const { sut, passwordHashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparerStub, 'compare')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return throw if PasswordHashComparer throws', async () => {
    const { sut, passwordHashComparerStub } = makeSut()
    jest
      .spyOn(passwordHashComparerStub, 'compare')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<string | null> = sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    await expect(promise).rejects.toThrow()
  })

  test('should return null if PasswordHashComparer fails', async () => {
    const { sut, passwordHashComparerStub } = makeSut()
    jest
      .spyOn(passwordHashComparerStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const accessToken = await sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    expect(accessToken).toBeNull()
  })

  test('should call PasswordHashComparer with correct values', async () => {
    const { sut, passwordHashComparerStub } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparerStub, 'compare')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should call TokenGeneratorAdapter with an user id', async () => {
    const { sut, tokenGeneratorAdapterStub } = makeSut()
    const getSpy = jest.spyOn(tokenGeneratorAdapterStub, 'encrypt')

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if TokenGeneratorAdapter throws', async () => {
    const { sut, tokenGeneratorAdapterStub } = makeSut()
    jest
      .spyOn(tokenGeneratorAdapterStub, 'encrypt')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<string | null> = sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    await expect(promise).rejects.toThrow()
  })

  test('should call UpdateAccountAccessTokenRepository with correct values', async () => {
    const { sut, updateAccountAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccountAccessTokenRepositoryStub,
      'update'
    )

    await sut.authenticate(makeFakeValidAuthenticationData())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should return throw if UpdateAccountAccessTokenRepository throws', async () => {
    const { sut, updateAccountAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccountAccessTokenRepositoryStub, 'update')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<string | null> = sut.authenticate(
      makeFakeValidAuthenticationData()
    )

    await expect(promise).rejects.toThrow()
  })
})
