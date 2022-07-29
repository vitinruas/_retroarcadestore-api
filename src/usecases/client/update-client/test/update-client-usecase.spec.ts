import { UpdateClientUseCase } from '../update-client-usecase'
import { IAccountEntitie } from '../../../../domain/entities/account/account-entitie'
import {
  IGetAccountByUIDRepository,
  IHashComparer,
  IHasher,
  IUpdateClientRepository,
  IUpdateClientUseCaseModel,
  IUpdateClientAddressRepository,
  IUpdateClientAddressRepositoryModel
} from '../update-client-usecase-protocols'

const makeFakeValidAccount = (): IAccountEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makeFakeValidUpdateData = () => ({
  uid: 'any_id',
  name: 'any_name',
  photo: 'any_photo',
  email: 'any_email',
  password: 'any_password',
  newPassword: 'new_password',
  street: 'any_street',
  postalCode: 1111111111,
  district: 'any_district',
  city: 'any_city',
  country: 'any_country'
})

const makeGetAccountByUIDRepositoryStub = (): IGetAccountByUIDRepository => {
  class GetClientByUIDRepositoryStub implements IGetAccountByUIDRepository {
    async get(uid: string): Promise<IAccountEntitie> {
      return Promise.resolve(makeFakeValidAccount())
    }
  }

  return new GetClientByUIDRepositoryStub()
}

const makePasswordHashComparerAdapterStub = () => {
  class PasswordHashComparerAdapterStub implements IHashComparer {
    compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new PasswordHashComparerAdapterStub()
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
    async update(dataToUpdate: IUpdateClientUseCaseModel): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateClientRepositoryStub()
}

const makeUpdateClientAddressRepositoryStub = () => {
  class UpdateClientAddressRepositoryStub
    implements IUpdateClientAddressRepository
  {
    async update(
      dataToUpdate: IUpdateClientAddressRepositoryModel
    ): Promise<void> {
      return Promise.resolve()
    }
  }
  return new UpdateClientAddressRepositoryStub()
}

interface ISut {
  sut: UpdateClientUseCase
  getAccountByUIDRepositoryStub: IGetAccountByUIDRepository
  passwordHashComparerAdapterStub: IHashComparer
  passwordHasherAdapterStub: IHasher
  updateClientRepositoryStub: IUpdateClientRepository
  updateClientAddressRepository: IUpdateClientAddressRepository
}

const makeSut = (): ISut => {
  const getAccountByUIDRepositoryStub = makeGetAccountByUIDRepositoryStub()
  const passwordHashComparerAdapterStub = makePasswordHashComparerAdapterStub()
  const passwordHasherAdapterStub = makePasswordHasherAdapterStub()
  const updateClientRepositoryStub = makeUpdateClientRepositoryStub()
  const updateClientAddressRepository = makeUpdateClientAddressRepositoryStub()
  const sut = new UpdateClientUseCase(
    getAccountByUIDRepositoryStub,
    passwordHashComparerAdapterStub,
    passwordHasherAdapterStub,
    updateClientRepositoryStub,
    updateClientAddressRepository
  )
  return {
    sut,
    getAccountByUIDRepositoryStub,
    passwordHasherAdapterStub,
    passwordHashComparerAdapterStub,
    updateClientRepositoryStub,
    updateClientAddressRepository
  }
}

describe('UpdateClientUseCase', () => {
  test('should call GetAccountByUIDRepository with an uid', async () => {
    const { sut, getAccountByUIDRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByUIDRepositoryStub, 'get')

    await sut.update(makeFakeValidUpdateData())

    expect(getSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return throw if GetAccountByUIDRepository throws', async () => {
    const { sut, getAccountByUIDRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByUIDRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update(makeFakeValidUpdateData())

    await expect(promise).rejects.toThrow()
  })

  test('should call PasswordHashComparerAdapter with correct values', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    const compareSpy = jest.spyOn(passwordHashComparerAdapterStub, 'compare')

    await sut.update(makeFakeValidUpdateData())

    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('should return throw if PasswordHashComparerAdapter throws', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    jest
      .spyOn(passwordHashComparerAdapterStub, 'compare')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update(makeFakeValidUpdateData())

    await expect(promise).rejects.toThrow()
  })

  test('should return false if PasswordHashComparerAdapter fails', async () => {
    const { sut, passwordHashComparerAdapterStub } = makeSut()
    jest
      .spyOn(passwordHashComparerAdapterStub, 'compare')
      .mockReturnValueOnce(Promise.resolve(false))

    const response: boolean = await sut.update(makeFakeValidUpdateData())

    expect(response).toBe(false)
  })

  test('should call PasswordHasherAdapter with a newPassword', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherAdapterStub, 'hash')

    await sut.update(makeFakeValidUpdateData())

    expect(hashSpy).toHaveBeenCalledWith('new_password')
  })

  test('should return throw if PasswordHasherAdapter throws', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    jest
      .spyOn(passwordHasherAdapterStub, 'hash')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<boolean> = sut.update(makeFakeValidUpdateData())

    await expect(promise).rejects.toThrow()
  })

  test('should call UpdateClientAddressRepository with correct values', async () => {
    const { sut, updateClientAddressRepository } = makeSut()
    const updateSpy = jest.spyOn(updateClientAddressRepository, 'update')

    await sut.update(makeFakeValidUpdateData())

    expect(updateSpy).toHaveBeenCalledWith({
      uid: 'any_id',
      street: 'any_street',
      postalCode: 1111111111,
      district: 'any_district',
      city: 'any_city',
      country: 'any_country'
    })
  })

  test('should call UpdateClientRepository correct values', async () => {
    const { sut, updateClientRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateClientRepositoryStub, 'update')

    await sut.update(makeFakeValidUpdateData())

    expect(updateSpy).toHaveBeenCalledWith(
      Object.assign({
        uid: 'any_id',
        name: 'any_name',
        photo: 'any_photo',
        email: 'any_email',
        password: 'hashed_password'
      })
    )
  })
})
