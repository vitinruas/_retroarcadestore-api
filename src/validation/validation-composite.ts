import { IValidation } from '../presentation/protocols/validation-protocol'

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}
  validate(fields: any): any {
    for (const validation of this.validations) {
      const error = validation.validate(fields)
      if (error) return error
    }
  }
}
