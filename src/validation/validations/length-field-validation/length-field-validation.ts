import { LengthFieldError } from '../validations-errors'
import { IValidation } from '../validations-protocols'

export class LengthFieldValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly minLength: number = 0,
    private readonly maxLength: number = 0
  ) {}

  validate(fields: any): any {
    const minMsg = `${this.fieldName} must have at least ${this.minLength} characters`
    const maxMsg = `${this.fieldName} must have maximum of ${this.maxLength} characters`

    const isSmaller: boolean =
      this.minLength !== 0 && fields[this.fieldName].length < this.minLength
    const isBigger: boolean =
      this.maxLength !== 0 && fields[this.fieldName].length > this.maxLength
    if (isSmaller) {
      return new LengthFieldError(minMsg)
    } else if (isBigger) {
      return new LengthFieldError(maxMsg)
    }
  }
}
