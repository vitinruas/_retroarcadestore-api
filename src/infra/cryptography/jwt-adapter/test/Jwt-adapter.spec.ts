import 'jsonwebtoken'
import { JwtAdapter } from '../jwt-adapter'

jest.mock('jsonwebtoken', () => ({
  sign(): string {
    return 'any_token'
  }
}))

describe('JwtAdapter', () => {
  test('should return a token', async () => {
    const sut = new JwtAdapter('secretKey')
    const token = await sut.encrypt('any_id')
    expect(token).toBe('any_token')
  })
})
