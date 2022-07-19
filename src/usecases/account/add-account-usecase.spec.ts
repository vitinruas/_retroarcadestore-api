import { IAccountEntitie } from 'src/domain/entities/account'
import { IAddAccountModel } from 'src/domain/usecases/account/add-account-usecase'
import { IGetAccountByEmailRepository } from '../protocols/account/get-account-by-email-repository'
import { IHasher } from '../protocols/account/hasher-protocol'
import { AddAccountUseCase } from './add-account-usecase'

const makeValidNewAccountData = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
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

interface ISut {
  sut: AddAccountUseCase
  passwordHasherStub: IHasher
  getAccountByEmailRepositoryStub: IGetAccountByEmailRepository
}

const makeSut = (): ISut => {
  const getAccountByEmailRepositoryStub = makeGetAccountByEmailRepositoryStub()
  const passwordHasherStub = makePasswordHasherStub()
  const sut = new AddAccountUseCase(
    getAccountByEmailRepositoryStub,
    passwordHasherStub
  )
  return {
    sut,
    passwordHasherStub,
    getAccountByEmailRepositoryStub
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
    jest.spyOn(getAccountByEmailRepositoryStub, 'get').mockReturnValueOnce(
      Promise.resolve({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        password: 'any_password',
        isAdmin: false
      })
    )

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
})
