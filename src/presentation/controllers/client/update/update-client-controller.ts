import {
  IController,
  IUpdateClientUseCase,
  IHttpRequest,
  IHttpResponse
} from './update-client-controller-protocols'
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import { NoFieldProvidedError, InvalidFieldError } from '../../../errors'
import { IValidation } from '../../../protocols'

export class UpdateClientController implements IController {
  constructor(
    private readonly validationCompositeStub: IValidation,
    private readonly updateClientUseCase: IUpdateClientUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const bodyKeys = Object.keys(httpRequest.body)
      if (bodyKeys.length === 2 && httpRequest.body.password) {
        return badRequest(new NoFieldProvidedError())
      } else if (bodyKeys.length > 1 || httpRequest.file) {
        // add photo param if exists file
        if (httpRequest.file) {
          Object.assign(httpRequest.body, {
            photo: httpRequest.file.filename
          })
        }

        // body validation
        const error: Error | void = await this.validationCompositeStub.validate(
          httpRequest.body
        )
        if (error) {
          return badRequest(error)
        }

        // update client data
        const isUpdated: boolean = await this.updateClientUseCase.update({
          ...httpRequest.body
        })
        if (!isUpdated) {
          return badRequest(new InvalidFieldError('password'))
        }
        return noContent()
      }
      return badRequest(new NoFieldProvidedError())
    } catch (error: any) {
      return serverError(error)
    }
  }
}
