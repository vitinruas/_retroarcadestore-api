import { IValidation } from '../presentation/protocols/validation-protocol'

export class ValidationComposite implements IValidation {
  constructor(private readonly validations: IValidation[]) {}
  async validate(fields: any): Promise<Error | void> {
    this.validations.map(async (validation) => {
      await validation.validate(fields)
    })
  }
}
