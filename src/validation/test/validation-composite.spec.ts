import { IHttpRequest } from '../../presentation/protocols/http-protocol'
import { IValidation } from '../../presentation/protocols/validation-protocol'
import { ValidationComposite } from '../validation-composite'

const makeFakeValidRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name'
  }
})

const makeValidationStub = (): IValidation => {
  class ValidationStub implements IValidation {
    async validate(fields: any): Promise<Error | void> {
      return Promise.resolve()
    }
  }
  return new ValidationStub()
}

interface ISut {
  sut: ValidationComposite
  validationStub: IValidation
}

const makeSut = (): ISut => {
  const validationStub: IValidation = makeValidationStub()
  const sut: ValidationComposite = new ValidationComposite([validationStub])
  return { sut, validationStub }
}

describe('ValidationComposite', () => {
  test('should call validations with fields', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')

    await sut.validate(makeFakeValidRequest().body)

    expect(validateSpy).toHaveBeenCalledWith(makeFakeValidRequest().body)
  })
})
