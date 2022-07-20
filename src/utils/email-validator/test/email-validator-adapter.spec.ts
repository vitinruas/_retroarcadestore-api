import 'validator'
import { EmailValidator } from '../email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator', () => {
  test('shoud returns true if provided email is valid', () => {
    const sut = new EmailValidator()
    const isValid = sut.validate('any_email@mail.com')
    expect(isValid).toBe(true)
  })
})
