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
  id: 'any_id',
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
  passwordHasherStub: IHasher
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
  addAccountRepositoryStub: IAddAccountRepository
  tokenGeneratorStub: IEncrypter
  updateAccountAccessTokenStub: IUpdateAccountAccessTokenRepository
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub: IGetAccountByEmailRepository =
    makeGetAccountByEmailRepositoryStub()
  const passwordHasherStub: IHasher = makePasswordHasherStub()
  const addAccountRepositoryStub: IAddAccountRepository =
    makeAddAccountRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const updateAccountAccessTokenStub = makeUpdateAccountAccessTokenStub()
  const sut = new AddAccountUseCase(
    getAccountByEmailRepositoryStub,
    passwordHasherStub,
    addAccountRepositoryStub,
    tokenGeneratorStub,
    updateAccountAccessTokenStub
  )
  return {
    sut,
    passwordHasherStub,
    getAccountByEmailRepositoryStub,
    addAccountRepositoryStub,
    tokenGeneratorStub,
    updateAccountAccessTokenStub
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
    const { sut, passwordHasherStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherStub, 'hash')

    await sut.add(makeValidNewAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })

  test('should return throw if PasswordHasher throws', async () => {
    const { sut, passwordHasherStub } = makeSut()
    jest
      .spyOn(passwordHasherStub, 'hash')
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

  test('should calls TokenGenerator with an user id', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const encryptSpy = jest.spyOn(tokenGeneratorStub, 'encrypt')

    await sut.add(makeValidNewAccountData())

    expect(encryptSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    jest
      .spyOn(tokenGeneratorStub, 'encrypt')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise = sut.add(makeValidNewAccountData())

    await expect(promise).rejects.toThrow()
  })

  test('should calls UpdateAccountAccessToken with correct values', async () => {
    const { sut, updateAccountAccessTokenStub } = makeSut()
    const updateSpy = jest.spyOn(updateAccountAccessTokenStub, 'update')

    await sut.add(makeValidNewAccountData())

    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('should return throw if UpdateAccountAccessToken throws', async () => {
    const { sut, updateAccountAccessTokenStub } = makeSut()
    jest
      .spyOn(updateAccountAccessTokenStub, 'update')
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
