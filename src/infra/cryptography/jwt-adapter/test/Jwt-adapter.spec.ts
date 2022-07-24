import jwt from 'jsonwebtoken'
import { JwtAdapter } from '../jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  },
  verify(): void {}
}))

describe('JwtAdapter', () => {
  describe('sign', () => {
    test('should call Jwt.sign with correct values', async () => {
      const sut = new JwtAdapter('secretKey')
      const signspy = jest.spyOn(jwt, 'sign')

      await sut.encrypt('any_value')

      expect(signspy).toHaveBeenCalledWith({ value: 'any_value' }, 'secretKey')
    })

    test('should return throw if Jwt.sign throws', async () => {
      const sut = new JwtAdapter('secretKey')
      jest
        .spyOn(jwt, 'sign')
        .mockImplementationOnce(async () => Promise.reject(new Error()))

      const promise: Promise<string> = sut.encrypt('any_value')

      expect(promise).rejects.toThrow()
    })

    test('should return a new token', async () => {
      const sut = new JwtAdapter('secretKey')

      const token = await sut.encrypt('any_value')

      expect(token).toBe('any_token')
    })
  })

  describe('verify', () => {
    test('should returns false if provided token is valid', async () => {
      const sut = new JwtAdapter('genericSecretKey')
      const generatedToken = await sut.encrypt('any_value')

      const isValid = await sut.decrypt(generatedToken)

      expect(isValid).toBe(false)
    })
  })
})
