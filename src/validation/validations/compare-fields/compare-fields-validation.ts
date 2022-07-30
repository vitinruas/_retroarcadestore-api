import { InvalidFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string
  ) {}

  validate(fields: any): any {
    if (fields[this.fieldName] !== fields[this.fieldNameToCompare]) {
      return new InvalidFieldError(this.fieldNameToCompare)
    }
  }
}
