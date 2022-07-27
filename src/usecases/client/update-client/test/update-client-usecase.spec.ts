import { IUpdateClientUseCaseModel } from '../../../../domain/usecases/client/update-client-usecase'
import { IHasher } from '../../../protocols/cryptography/hasher-protocol'
import { IUpdateClientRepository } from '../../../protocols/repository/client/update-client-repository-protocol'
import { UpdateClientUseCase } from '../update-client-usecase'

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

interface ISut {
  sut: UpdateClientUseCase
  passwordHasherAdapterStub: IHasher
  updateClientRepositoryStub: IUpdateClientRepository
}

const makeSut = (): ISut => {
  const passwordHasherAdapterStub = makePasswordHasherAdapterStub()
  const updateClientRepositoryStub = makeUpdateClientRepositoryStub()
  const sut = new UpdateClientUseCase(
    passwordHasherAdapterStub,
    updateClientRepositoryStub
  )
  return {
    sut,
    passwordHasherAdapterStub,
    updateClientRepositoryStub
  }
}

describe('UpdateClientUseCase', () => {
  test('should call PasswordHasher with a password', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherAdapterStub, 'hash')

    await sut.update({
      password: 'new_password'
    })

    expect(hashSpy).toHaveBeenCalledWith('new_password')
  })

  test('should return throw if PasswordHasher throws', async () => {
    const { sut, passwordHasherAdapterStub } = makeSut()
    jest
      .spyOn(passwordHasherAdapterStub, 'hash')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const promise: Promise<void> = sut.update({
      password: 'new_password'
    })

    expect(promise).rejects.toThrow()
  })

  test('should call UpdateClientRepository correct values', async () => {
    const { sut, updateClientRepositoryStub } = makeSut()
    const updateSpy = jest.spyOn(updateClientRepositoryStub, 'update')

    await sut.update({
      name: 'new_name',
      password: 'new_password'
    })

    expect(updateSpy).toHaveBeenCalledWith({
      name: 'new_name',
      password: 'hashed_password'
    })
  })
})
