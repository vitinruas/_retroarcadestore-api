import { IController } from 'src/presentation/protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'

export class SignUpController implements IController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
    for (const requiredField of requiredFields) {
      if (!httpRequest.body[requiredField]) {
        return {
          statusCode: 400,
          body: `Missing param: ${requiredField}`
        }
      }
    }
    return {
      statusCode: 200,
      body: null
    }
  }
}
