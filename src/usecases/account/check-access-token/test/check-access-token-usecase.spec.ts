import { IDecrypter } from '../../../protocols/cryptography/decrypter-protocol'
import { IAccountEntitie } from '../../../../domain/entities/account'
import { CheckAccessTokenUseCase } from '../check-access-token-usecase'
import { IGetAccountByAccessTokenRepository } from '../../../protocols/repository/account/get-account-by-access-token-repository'

const makeTokenDecrypterAdapterStub = (): IDecrypter => {
  class TokenDecrypterAdapterStub implements IDecrypter {
    async decrypt(token: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new TokenDecrypterAdapterStub()
}

const makeGetAccountByAccessTokenRepositoryStub =
  (): IGetAccountByAccessTokenRepository => {
    class GetAccountByAccessTokenRepository
      implements IGetAccountByAccessTokenRepository
    {
      async get(
        token: string,
        admin?: boolean
      ): Promise<IAccountEntitie | null> {
        return Promise.resolve({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'hashed_password'
        })
      }
    }

    return new GetAccountByAccessTokenRepository()
  }

interface ISut {
  sut: CheckAccessTokenUseCase
  tokenDecrypterAdapterStub: IDecrypter
  getAccountByAccessTokenRepositoryStub: IGetAccountByAccessTokenRepository
}

const makeSut = (): ISut => {
  const tokenDecrypterAdapterStub = makeTokenDecrypterAdapterStub()
  const getAccountByAccessTokenRepositoryStub =
    makeGetAccountByAccessTokenRepositoryStub()
  const sut = new CheckAccessTokenUseCase(
    false,
    tokenDecrypterAdapterStub,
    getAccountByAccessTokenRepositoryStub
  )
  return {
    sut,
    tokenDecrypterAdapterStub,
    getAccountByAccessTokenRepositoryStub
  }
}

describe('CheckAccessTokenUseCase', () => {
  test('should call TokenDecrypterAdapter with a token', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    const decryptSpy = jest.spyOn(tokenDecrypterAdapterStub, 'decrypt')

    await sut.check('any_token')

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if TokenDecrypterAdapter throws', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    jest
      .spyOn(tokenDecrypterAdapterStub, 'decrypt')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const account: Promise<IAccountEntitie | null> = sut.check('any_token')

    await expect(account).rejects.toThrow()
  })

  test('should return null if TokenDecrypterAdapter fails', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    jest
      .spyOn(tokenDecrypterAdapterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(null))

    const account: IAccountEntitie | null = await sut.check('any_token')

    expect(account).toBeNull()
  })

  test('should call GetAccountByAccessTokenRepository with correct values', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByAccessTokenRepositoryStub, 'get')

    await sut.check('any_token')

    expect(getSpy).toHaveBeenCalledWith('any_token', false)
  })

  test('should return throw if GetAccountByAccessTokenRepository throws', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByAccessTokenRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const account: Promise<IAccountEntitie | null> = sut.check('any_token')

    await expect(account).rejects.toThrow()
  })

  test('should return null if GetAccountByAccessTokenRepository fails', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByAccessTokenRepositoryStub, 'get')
      .mockReturnValueOnce(Promise.resolve(null))

    const account: IAccountEntitie | null = await sut.check('any_token')

    expect(account).toBeNull()
  })
})
