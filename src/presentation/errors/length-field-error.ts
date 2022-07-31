/* eslint-disable no-this-before-super */
/* eslint-disable constructor-super */
export class LengthFieldError extends Error {
  constructor(field: string, min: number, max?: number) {
    const minMsg = `${field} must have at least ${min} characters.`
    const maxMsg = `${field} must have maximum of ${max} characteres`
    const fullMsg = `${field} must have a minimum of ${min} characters and maximum of ${max} characteres`

    let msg: string = ''
    if (min) {
      msg = minMsg
    } else if (max) {
      msg = maxMsg
    } else {
      msg = fullMsg
    }

    super(msg)
    this.name = 'LengthFieldError'
  }
}
