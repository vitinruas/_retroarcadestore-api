import {
  IController,
  IEmailValidatorAdapter,
  IUpdateClientUseCase,
  IHttpRequest,
  IHttpResponse
} from './update-client-controller-protocols'
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import {
  NoFieldProvidedError,
  InvalidFieldError,
  MissingFieldError
} from '../../../errors'

export class UpdateClientController implements IController {
  constructor(
    private readonly emailValidatorAdapter: IEmailValidatorAdapter,
    private readonly updateClientUseCase: IUpdateClientUseCase
  ) {}

  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    console.log(httpRequest)
    try {
      const httpRequestKeys: ReadonlyArray<string> = Object.keys(
        httpRequest.body
      )
      // check if anything field was provided
      if (httpRequestKeys.length > 1 || httpRequest.file) {
        const {
          email,
          postalCode,
          password,
          newPassword,
          newPasswordConfirmation
        } = httpRequest.body
        const requiredFields: ReadonlyArray<string> = ['name', 'email']
        for (const field of requiredFields) {
          if (httpRequestKeys.includes(field) && !httpRequest.body[field]) {
            return badRequest(new MissingFieldError(field))
          }
        }

        if ((newPassword || newPasswordConfirmation) && !password) {
          return badRequest(new MissingFieldError('password'))
        }

        // check passwords match
        if (newPassword !== newPasswordConfirmation) {
          return badRequest(new InvalidFieldError('newPasswordConfirmation'))
        }

        if (httpRequest.file) {
          Object.assign(httpRequest.body, {
            photo: httpRequest.file.filename
          })
        }

        // check if provided postal code is valid and has a valid length
        if (postalCode) {
          if (
            !Number(httpRequest.body.postalCode) ||
            httpRequest.body.postalCode.length > 10 ||
            httpRequest.body.postalCode.length < 5
          ) {
            return badRequest(new InvalidFieldError('postalCode'))
          }
        }

        // check if an email was provided
        if (email) {
          if (!password) {
            return badRequest(new MissingFieldError('password'))
          }
          // check if the provided email is valid
          const isValid: boolean = this.emailValidatorAdapter.validate(email)
          if (!isValid) {
            return badRequest(new InvalidFieldError('email'))
          }
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
