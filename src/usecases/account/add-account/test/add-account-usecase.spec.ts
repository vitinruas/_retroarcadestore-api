import { AddAccountUseCase } from '../add-account-usecase'
import {
  IAccountEntitie,
  IAddAccountModel,
  IGetAccountByEmailRepository,
  IHasher,
  IEncrypter,
  IAddAccountRepository,
  IUpdateAccountAccessTokenRepository
} from '../add-account-usecase-protocols'

const makeValidNewAccountData = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

const makeValidCreatedAccountData = (): IAccountEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makePasswordHasherStub = () => {
  class PasswordHasherStub implements IHasher {
    async hash(password: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new PasswordHasherStub()
}

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

const makeAddAccountRepositoryStub = () => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(newAccountData: IAddAccountModel): Promise<IAccountEntitie> {
      return Promise.resolve(makeValidCreatedAccountData())
    }
  }
  return new AddAccountRepositoryStub()
}

const makeTokenGeneratorStub = () => {
  class TokenGeneratorStub implements IEncrypter {
    async encrypt(id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

const makeUpdateAccountAccessTokenStub = () => {
  class UpdateAccountAccessTokenStub
    implements IUpdateAccountAccessTokenRepository
  {
    async update(id: string, accessToken: string): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateAccountAccessTokenStub()
}

interface ISut {
  sut: AddAccountUseCase
  passwordHasherAdapterStub: IHasher
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
  addAccountRepositoryStub: IAddAccountRepository
  tokenGeneratorAdapterStub: IEncrypter
  updateAccountAccessTokenRepositoryStub: IUpdateAccountAccessTokenRepository
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub: IGetAccountByEmailRepository =
    makeGetAccountByEmailRepositoryStub()
  const passwordHasherAdapterStub: IHasher = makePasswordHasherStub()
  const addAccountRepositoryStub: IAddAccountRepository =
    makeAddAccountRepositoryStub()
  const tokenGeneratorAdapterStub = makeTokenGeneratorStub()
  const updateAccountAccessTokenRepositoryStub =
    makeUpdateAccountAccessTokenStub()
  const sut = new AddAccountUseCase(
    getAccountByEmailRepositoryStub,
    passwordHasherAdapterStub,
    addAccountRepositoryStub,
    tokenGeneratorAdapterStub,
    updateAccountAccessTokenRepositoryStub
  )
  return {
    sut,
    passwordHasherAdapterStub,
    getAccountByEmailRepositoryStub,
    addAccountRepositoryStub,
    tokenGeneratorAdapterStub,
    updateAccountAccessTokenRepositoryStub
  }
}

describe('AddAccountUseCase', () => {
  test('should call GetAccountByEmailRepository with correct values', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByEmailRepositoryStub, 'get')

    await sut.add(makeValidNewAccountData())

    expect(getSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('should return throw if GetAccountByEmailRepository throws', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should return null if GetAccountByEmailRepository returns an account', async () => {
    const { sut, getAccountByEmailRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByEmailRepositoryStub, 'get')
      .mockReturnValueOnce(Promise.resolve(makeValidCreatedAccountData()))

    const accessToken = await sut.add(makeValidNewAccountData())

    expect(accessToken).toBe(null)
  })

  test('should calls PasswordHasher with a password', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherAdapterStub, 'hash')

    await sut.add(makeValidNewAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('should return throw if PasswordHasher throws', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    jest
      .spyOn(passwordHasherAdapterStub, 'hash')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should calls AddAccountRepository with correct values', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')

    await sut.add(makeValidNewAccountData())

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_password'
    })
  })

  test('should return throw if AddAccountRepository throws', async () => {
    const { sut, addAccountRepositoryStub } = makeSut()
    jest
      .spyOn(addAccountRepositoryStub, 'add')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should calls TokenGenerator with an uid', async () => {
    const { sut, tokenGeneratorAdapterStub } = makeSut()
    const encryptSpy = jest.spyOn(tokenGeneratorAdapterStub, 'encrypt')

    await sut.add(makeValidNewAccountData())

    expect(encryptSpy).toHaveBeenCalledWith('any_uid')
  })

  test('should return throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorAdapterStub } = makeSut()
    jest
      .spyOn(tokenGeneratorAdapterStub, 'encrypt')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should calls UpdateAccountAccessToken with correct values', async () => {
    const { sut, updateAccountAccessTokenRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(
      updateAccountAccessTokenRepositoryStub,
      'update'
    )

    await sut.add(makeValidNewAccountData())

    expect(updateSpy).toHaveBeenCalledWith('any_uid', 'any_token')
  })

  test('should return throw if UpdateAccountAccessToken throws', async () => {
    const { sut, updateAccountAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(updateAccountAccessTokenRepositoryStub, 'update')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should returns an access token', async () => {
    const { sut } = makeSut()

    const accessToken = await sut.add(makeValidNewAccountData())

    expect(accessToken).toBe('any_token')
  })
})
