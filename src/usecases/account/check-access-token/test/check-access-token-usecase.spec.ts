import { IDecrypter } from '../../../protocols/cryptography/decrypter-protocol'
import { IAccountEntitie } from '../../authentication/authentication-usecase-protocols'
import { CheckAccessTokenUseCase } from '../check-access-token-usecase'

const makeTokenDecrypterAdapterStub = (): IDecrypter => {
  class TokenDecrypterAdapterStub implements IDecrypter {
    async decrypt(token: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }

  return new TokenDecrypterAdapterStub()
}

interface ISut {
  sut: CheckAccessTokenUseCase
  tokenDecrypterAdapterStub: IDecrypter
}

const makeSut = (): ISut => {
  const tokenDecrypterAdapterStub = makeTokenDecrypterAdapterStub()
  const sut = new CheckAccessTokenUseCase(tokenDecrypterAdapterStub)
  return {
    sut,
    tokenDecrypterAdapterStub
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
})
