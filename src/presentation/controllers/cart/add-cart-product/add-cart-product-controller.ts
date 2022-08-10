import { IAddCartProductUseCase } from '../../../../domain/usecases/cart/add-cart-product-usecase'
import { ok } from '../../../helpers/http-response-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../../protocols'

export class AddCartProductController implements IController {
  constructor(private readonly addCartProductUseCase: IAddCartProductUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.addCartProductUseCase.add(httpRequest.body.pid)
    return Promise.resolve(ok())
  }
}
