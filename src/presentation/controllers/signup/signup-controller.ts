import { IController } from 'src/presentation/protocols/controller-protocol'
import {
  IHttpRequest,
  IHttpResponse
} from 'src/presentation/protocols/http-protocol'

export class SignUpController implements IController {
  perform(httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: 'Missing param: name'
      }
    }

    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: 'Missing param: email'
      }
    }

    if (!httpRequest.body.password) {
      return {
        statusCode: 400,
        body: 'Missing param: password'
      }
    }

    if (!httpRequest.body.passwordConfirmation) {
      return {
        statusCode: 400,
        body: 'Missing param: passwordConfirmation'
      }
    }
    return {
      statusCode: 200,
      body: null
    }
  }
}
