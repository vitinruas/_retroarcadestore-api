import { InvalidFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class CheckIfValueExistsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly list: ReadonlyArray<string>
  ) {}

  validate(fields: any): any {
    if (!this.list.includes(fields[this.fieldName])) {
      return new InvalidFieldError(this.fieldName)
    }
  }
}
