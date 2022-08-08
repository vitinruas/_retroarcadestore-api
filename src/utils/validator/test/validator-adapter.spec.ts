import 'validator'
import { ValidatorAdapter } from '../validator-adapter'

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true
  }
}))

describe('Validator', () => {
  describe('ValidatorAdapter', () => {
    test('shoud returns true if provided email is valid', () => {
      const sut: ValidatorAdapter = new ValidatorAdapter()
      const isValid = sut.validateEmail('any_email@mail.com')
      expect(isValid).toBe(true)
    })
  })
  describe('AlphaValidator', () => {
    test('shoud returns true if provided value is valid', () => {
      const sut: ValidatorAdapter = new ValidatorAdapter()
      const isValid = sut.validateEmail('any_email@mail.com')
      expect(isValid).toBe(true)
    })
  })
})
