import { IUpdateClientUseCaseModel } from '../../../../domain/usecases/client/update-client-usecase'
import { IAccountEntitie } from '../../../account/authentication/authentication-usecase-protocols'
import { IHashComparer } from '../../../protocols/cryptography/hash-comparer-protocol'
import { IHasher } from '../../../protocols/cryptography/hasher-protocol'
import { IGetAccountByUIDRepository } from '../../../protocols/repository/account/get-account-by-uid-repository-protocol'
import { IUpdateClientRepository } from '../../../protocols/repository/client/update-client-repository-protocol'
import { UpdateClientUseCase } from '../update-client-usecase'

const makeFakeValidAccount = (): IAccountEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makeGetAccountByUIDRepositoryStub = (): IGetAccountByUIDRepository => {
  class GetClientByUIDRepositoryStub implements IGetAccountByUIDRepository {
    async get(uid: string): Promise<IAccountEntitie> {
      return Promise.resolve(makeFakeValidAccount())
    }
  }

  return new GetClientByUIDRepositoryStub()
}

const makePasswordHasherAdapterStub = () => {
  class PasswordHasherStub implements IHasher {
    async hash(password: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new PasswordHasherStub()
}

const makeUpdateClientRepositoryStub = () => {
  class UpdateClientRepositoryStub implements IUpdateClientRepository {
    async update(data: IUpdateClientUseCaseModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateClientRepositoryStub()
}

const makePasswordHashComparerAdapterStub = () => {
  class PasswordHashComparerAdapterStub implements IHashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new PasswordHashComparerAdapterStub()
}

interface ISut {
  sut: UpdateClientUseCase
  getAccountByUIDRepositoryStub: IGetAccountByUIDRepository
  passwordHashComparerAdapterStub: IHashComparer
  passwordHasherAdapterStub: IHasher
  updateClientRepositoryStub: IUpdateClientRepository
}

const makeSut = (): ISut => {
  const getAccountByUIDRepositoryStub = makeGetAccountByUIDRepositoryStub()
  const passwordHashComparerAdapterStub = makePasswordHashComparerAdapterStub()
  const passwordHasherAdapterStub = makePasswordHasherAdapterStub()
  const updateClientRepositoryStub = makeUpdateClientRepositoryStub()
  const sut = new UpdateClientUseCase(
    getAccountByUIDRepositoryStub,
    passwordHashComparerAdapterStub,
    passwordHasherAdapterStub,
    updateClientRepositoryStub
  )
  return {
    sut,
    getAccountByUIDRepositoryStub,
    passwordHasherAdapterStub,
    passwordHashComparerAdapterStub,
    updateClientRepositoryStub
  }
}

describe('UpdateClientUseCase', () => {
  test('should call GetAccountByUIDRepository with an uid', async () => {
    const { sut, getAccountByUIDRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByUIDRepositoryStub, 'get')

    await sut.update({
      uid: 'any_id',
      password: 'any_password'
    })

    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if GetAccountByUIDRepository throws', async () => {
    const { sut, getAccountByUIDRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByUIDRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update({
      uid: 'any_id',
      password: 'any_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('should call PasswordHashComparerAdapter with correct values', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparerAdapterStub, 'compare')

    await sut.update({
      uid: 'any_id',
      password: 'any_password'
    })

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return throw if PasswordHashComparerAdapter throws', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    jest
      .spyOn(passwordHashComparerAdapterStub, 'compare')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update({
      uid: 'any_id',
      password: 'any_password',
      newPassword: 'new_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('should return false if PasswordHashComparerAdapter fails', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    jest
      .spyOn(passwordHashComparerAdapterStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const response: boolean = await sut.update({
      uid: 'any_id',
      password: 'any_password',
      newPassword: 'new_password'
    })

    expect(response).toBe(false)
  })

  test('should call PasswordHasher with a newPassword', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherAdapterStub, 'hash')

    await sut.update({
      uid: 'any_id',
      password: 'any_password',
      newPassword: 'new_password'
    })

    expect(hashSpy).toHaveBeenCalledWith('new_password')
  })

  test('should return throw if PasswordHasher throws', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    jest
      .spyOn(passwordHasherAdapterStub, 'hash')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update({
      uid: 'any_id',
      password: 'any_password',
      newPassword: 'new_password'
    })

    await expect(promise).rejects.toThrow()
  })

  test('should call UpdateClientRepository correct values', async () => {
    const { sut, updateClientRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateClientRepositoryStub, 'update')

    await sut.update({
      uid: 'any_id',
      name: 'new_name',
      password: 'any_password',
      newPassword: 'hashed_password'
    })

    expect(updateSpy).toHaveBeenCalledWith({
      uid: 'any_id',
      name: 'new_name',
      password: 'any_password',
      newPassword: 'hashed_password'
    })
  })
})
