import { IAddCartProductUseCase } from '../../../../domain/usecases/cart/add-cart-product-usecase'
import { InvalidFieldError } from '../../../errors'
import {
  badRequest,
  noContent,
  serverError
} from '../../../helpers/http-response-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../../protocols'

export class AddCartProductController implements IController {
  constructor(private readonly addCartProductUseCase: IAddCartProductUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const productHasBeenAdded: boolean = await this.addCartProductUseCase.add(
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
