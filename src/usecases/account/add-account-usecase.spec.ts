import { IAddAccountModel } from 'src/domain/usecases/account/add-account-usecase'
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

interface ISut {
  sut: AddAccountUseCase
  passwordHasherStub: IHasher
}

const makeSut = (): ISut => {
  const passwordHasherStub = makePasswordHasherStub()
  const sut = new AddAccountUseCase(passwordHasherStub)
  return {
    sut,
    passwordHasherStub
  }
}

describe('AddAccountUseCase', () => {
  test('should calls PasswordHasher with a password', () => {
    const { sut, passwordHasherStub } = makeSut()
    const hashSpy = jest.spyOn(passwordHasherStub, 'hash')
    sut.add(makeValidNewAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
})
