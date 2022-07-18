export class SignUpController {
  perform(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        code: 400,
        body: 'Missing param: name'
      }
    }

    if (!httpRequest.body.email) {
      return {
        code: 400,
        body: 'Missing param: email'
      }
    }

    if (!httpRequest.body.password) {
      return {
        code: 400,
        body: 'Missing param: password'
      }
    }
    return null
  }
}
