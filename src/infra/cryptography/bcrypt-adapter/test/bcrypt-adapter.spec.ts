import { BcryptAdapter } from '../bcrypt-adapter'

jest.mock('bcrypt', () => ({
  hash(): string {
    return 'hashed_value'
  },

  compare(): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

describe('BcryptAdapter', () => {
  describe('hash', () => {
    test('should return a hashed password', async () => {
      const sut = new BcryptAdapter(12)
      const hashedPassword = await sut.hash('any_value')
      expect(hashedPassword).toBe('hashed_value')
    })
  })
  describe('compare', () => {
    test('should return true if Bcrypt.compare succeeds', async () => {
      const sut = new BcryptAdapter(12)
      const hashedPassword = await sut.compare('any_value', 'hashed_value')
      expect(hashedPassword).toBe(true)
    })
  })
})
