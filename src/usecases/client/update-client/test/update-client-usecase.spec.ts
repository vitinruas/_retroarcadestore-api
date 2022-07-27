import { IHasher } from '../../../protocols/cryptography/hasher-protocol'
import { UpdateClientUseCase } from '../update-client-usecase'

const makePasswordHasherAdapterStub = () => {
  class PasswordHasherStub implements IHasher {
    async hash(password: string): Promise<string> {
      return Promise.resolve('hashed_password')
    }
  }
  return new PasswordHasherStub()
}

interface ISut {
  sut: UpdateClientUseCase
  passwordHasherAdapterStub: IHasher
}

const makeSut = (): ISut => {
  const passwordHasherAdapterStub = makePasswordHasherAdapterStub()
  const sut = new UpdateClientUseCase(passwordHasherAdapterStub)
  return {
    sut,
    passwordHasherAdapterStub
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
})
