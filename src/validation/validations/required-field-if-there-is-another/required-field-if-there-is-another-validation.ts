import { MissingFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class RequiredFieldIfThereisAnother implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameThatMustBeProvided: string
  ) {}

  validate(input: any): any {
    if (input[this.fieldName]) {
      if (!input[this.fieldNameThatMustBeProvided]) {
        return new MissingFieldError(this.fieldNameThatMustBeProvided)
      }
    }
  }
}
