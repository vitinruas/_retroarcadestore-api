import { JwtAdapter } from '../jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  },
  verify(): void {}
}))

describe('JwtAdapter', () => {
  describe('sign', () => {
    test('should return a new token', async () => {
      const sut = new JwtAdapter('secretKey')
      const token = await sut.encrypt('any_id')
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
