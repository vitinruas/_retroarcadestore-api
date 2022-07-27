import { IUpdateClientUseCaseModel } from '../../../../domain/usecases/client/update-client-usecase'
import { IHashComparer } from '../../../protocols/cryptography/hash-comparer-protocol'
import { IHasher } from '../../../protocols/cryptography/hasher-protocol'
import { IUpdateClientRepository } from '../../../protocols/repository/client/update-client-repository-protocol'
import {
  IGetClientByUIDRepository,
  IGetClientModel
} from '../../get-client/get-client-usecase-protocols'
import { UpdateClientUseCase } from '../update-client-usecase'

const makeFakeValidAccount = (): IGetClientModel => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  createdAt: 'any_date',
  authenticatedAt: 'any_date'
})

const makeGetClientByUIDRepositoryStub = (): IGetClientByUIDRepository => {
  class GetClientByUIDRepositoryStub implements IGetClientByUIDRepository {
    async get(uid: string): Promise<IGetClientModel> {
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
    async update(data: IUpdateClientUseCaseModel): Promise<IGetClientModel> {
      return Promise.resolve(makeFakeValidAccount())
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
  getClientByUIDRepositoryStub: IGetClientByUIDRepository
  passwordHashComparerAdapterStub: IHashComparer
  passwordHasherAdapterStub: IHasher
  updateClientRepositoryStub: IUpdateClientRepository
}

const makeSut = (): ISut => {
  const getClientByUIDRepositoryStub = makeGetClientByUIDRepositoryStub()
  const passwordHashComparerAdapterStub = makePasswordHashComparerAdapterStub()
  const passwordHasherAdapterStub = makePasswordHasherAdapterStub()
  const updateClientRepositoryStub = makeUpdateClientRepositoryStub()
  const sut = new UpdateClientUseCase(
    getClientByUIDRepositoryStub,
    passwordHashComparerAdapterStub,
    passwordHasherAdapterStub,
    updateClientRepositoryStub
  )
  return {
    sut,
    getClientByUIDRepositoryStub,
    passwordHasherAdapterStub,
    passwordHashComparerAdapterStub,
    updateClientRepositoryStub
  }
}

describe('UpdateClientUseCase', () => {
  test('should call GetClientByUIDRepository with an uid', async () => {
    const { sut, getClientByUIDRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getClientByUIDRepositoryStub, 'get')

    await sut.update({
      uid: 'any_id',
      password: 'any_password'
    })

    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should call PasswordHashComparerAdapter with a password', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparerAdapterStub, 'compare')

    await sut.update({
      uid: 'any_id',
      password: 'any_password'
    })

    expect(compareSpy).toHaveBeenCalledWith('any_password', '')
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
