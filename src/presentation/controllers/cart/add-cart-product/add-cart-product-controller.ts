import { InvalidFieldError } from '../../../errors'
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import {
  IController,
  IAddCartProductUseCase,
  IHttpRequest,
  IHttpResponse
} from './add-cart-product-controller-protocols'

export class AddCartProductController implements IController {
  constructor(private readonly addCartProductUseCase: IAddCartProductUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const productHasBeenAdded: boolean = await this.addCartProductUseCase.add(
        httpRequest.body.uid,
        httpRequest.body.pid
      )
      if (!productHasBeenAdded) {
        return badRequest(new InvalidFieldError('product'))
      }
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
