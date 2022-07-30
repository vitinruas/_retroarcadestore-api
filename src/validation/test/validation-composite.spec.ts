import { InvalidFieldError, MissingFieldError } from '../../presentation/errors'
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
    validate(fields: any): Promise<Error | void> {
      return Promise.resolve()
    }
  }
  return new ValidationStub()
}

interface ISut {
  sut: ValidationComposite
  validationStubs: IValidation[]
}

const makeSut = (): ISut => {
  const validationStubs: IValidation[] = [
    makeValidationStub(),
    makeValidationStub()
  ]
  const sut: ValidationComposite = new ValidationComposite(validationStubs)
  return { sut, validationStubs }
}

describe('ValidationComposite', () => {
  test('should call validations with fields', () => {
    const { sut, validationStubs } = makeSut()
    const validateSpy = jest.spyOn(validationStubs[0], 'validate')

    sut.validate(makeFakeValidRequest().body)

    expect(validateSpy).toHaveBeenCalledWith(makeFakeValidRequest().body)
  })

  test('should return the first instance error if validation fails', async () => {
    const { sut, validationStubs } = makeSut()
    jest
      .spyOn(validationStubs[0], 'validate')
      .mockReturnValue(Promise.resolve(new InvalidFieldError('field')))
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValue(Promise.resolve(new MissingFieldError('field')))

    const error = await sut.validate(makeFakeValidRequest().body)

    expect(error).toEqual(new InvalidFieldError('field'))
  })
})
