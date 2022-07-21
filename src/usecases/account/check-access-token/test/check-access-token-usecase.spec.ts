import { IDecrypter } from '../../../protocols/cryptography/decrypter-protocol'
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
  test('should call TokenDecrypter with a token', async () => {
    const { sut, tokenDecrypterAdapterStub } = makeSut()
    const decryptSpy = jest.spyOn(tokenDecrypterAdapterStub, 'decrypt')

    await sut.check('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
