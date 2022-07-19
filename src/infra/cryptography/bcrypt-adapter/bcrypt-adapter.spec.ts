import { BcryptAdapter } from './bcrypt-adapter'
import 'bcrypt'

jest.mock('bcrypt', () => ({
  hash(): string {
    return 'hashed_password'
  }
}))

describe('BcryptAdapter', () => {
  test('should return a hashed password', async () => {
    const sut = new BcryptAdapter(12)
    const hashedPassword = await sut.hash('any_password')
    expect(hashedPassword).toBe('hashed_password')
  })
})
