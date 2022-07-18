export class SignUpController {
  perform(httpRequest: any): any {
    if (!httpRequest.body.name) {
      return {
        code: 400,
        body: 'Missing param: name'
      }
    }
    return null
  }
}
