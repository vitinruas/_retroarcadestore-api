import { IAlphaValidatorAdapter } from '../../protocols/alpha-validator-protocol'
import { IValidation } from '../validations-protocols'
import { InvalidFieldError } from '../validations-errors'
export class CheckIfValueIsAlpha implements IValidation {
  constructor(
    private readonly alphaValidator: IAlphaValidatorAdapter,
    private readonly fieldName: string
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName]) {
      const isValid: boolean = this.alphaValidator.validateAlpha(
        fields[this.fieldName]
      )
      if (!isValid) {
        return new InvalidFieldError(this.fieldName)
      }
    }
  }
}
