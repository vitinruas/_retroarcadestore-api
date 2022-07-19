import { IAddAccountModel } from 'src/domain/usecases/account/add-account-usecase'
import { IHasher } from '../protocols/account/hasher-protocol'
import { AddAccountUseCase } from './add-account-usecase'

const makeValidNewAccountData = (): IAddAccountModel => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

describe('AddAccountUseCase', () => {
  test('should calls Bcrypt with a password', () => {
    class BcryptAdapterStub implements IHasher {
      async hash(password: string): Promise<string> {
        return Promise.resolve('hashed_password')
      }
    }
    const bcryptAdapterStub = new BcryptAdapterStub()
    const sut = new AddAccountUseCase(bcryptAdapterStub)
    const hashSpy = jest.spyOn(bcryptAdapterStub, 'hash')
    sut.add(makeValidNewAccountData())

    expect(hashSpy).toHaveBeenCalledWith('any_password')
  })
})
