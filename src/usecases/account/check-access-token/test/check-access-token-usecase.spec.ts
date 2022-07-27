import { CheckAccessTokenUseCase } from '../check-access-token-usecase'
import {
  IAccountEntitie,
  IGetAccountByAccessTokenRepository,
  IDecrypter
} from '../check-access-token-usecase-protocols'

const makeFakeValidAccount = (): IAccountEntitie => ({
  uid: 'any_uid',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  accessToken: 'any_token'
})

const makeTokenDecrypterAdapterStub = (): IDecrypter => {
  class TokenDecrypterAdapterStub implements IDecrypter {
    async decrypt(token: string): Promise<boolean> {
      return Promise.resolve(true)
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
        return Promise.resolve(makeFakeValidAccount())
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

    await sut.check('any_token', false)

    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })

  test('should return throw if TokenDecrypterAdapter throws', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    jest
      .spyOn(tokenDecrypterAdapterStub, 'decrypt')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const account: Promise<IAccountEntitie | null> = sut.check(
      'any_token',
      false
    )

    await expect(account).rejects.toThrow()
  })

  test('should return false if TokenDecrypterAdapter fails', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    jest
      .spyOn(tokenDecrypterAdapterStub, 'decrypt')
      .mockReturnValueOnce(Promise.resolve(false))

    const account: IAccountEntitie | null = await sut.check('any_token', false)

    expect(account).toBeNull()
  })

  test('should call GetAccountByAccessTokenRepository with correct values', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    const getSpy = jest.spyOn(getAccountByAccessTokenRepositoryStub, 'get')

    await sut.check('any_token', false)

    expect(getSpy).toHaveBeenCalledWith('any_token', false)
  })

  test('should return throw if GetAccountByAccessTokenRepository throws', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByAccessTokenRepositoryStub, 'get')
      .mockImplementationOnce(async () => Promise.reject(new Error()))

    const account: Promise<IAccountEntitie | null> = sut.check(
      'any_token',
      false
    )

    await expect(account).rejects.toThrow()
  })

  test('should return null if GetAccountByAccessTokenRepository fails', async () => {
    const { sut, getAccountByAccessTokenRepositoryStub } = makeSut()
    jest
      .spyOn(getAccountByAccessTokenRepositoryStub, 'get')
      .mockReturnValueOnce(Promise.resolve(null))

    const account: IAccountEntitie | null = await sut.check('any_token', false)

    expect(account).toBeNull()
  })
  test('should return an account if GetAccountByAccessTokenRepository succeds', async () => {
    const { sut } = makeSut()

    const account: IAccountEntitie | null = await sut.check('any_token', false)

    expect(account).toEqual(makeFakeValidAccount())
  })
})
