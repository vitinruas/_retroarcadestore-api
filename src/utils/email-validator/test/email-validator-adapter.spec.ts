import 'validator'
import { EmailValidatorAdapter } from '../email-validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('EmailValidator', () => {
  test('shoud returns true if provided email is valid', () => {
    const sut: EmailValidatorAdapter = new EmailValidatorAdapter()
    const isValid = sut.validateEmail('any_email@mail.com')
    expect(isValid).toBe(true)
  })
})
