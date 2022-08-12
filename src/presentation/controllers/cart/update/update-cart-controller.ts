import { noContent, serverError } from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse,
  IUpdateCartUseCase
} from './update-cart-controller-protocols'

export class UpdateCartController implements IController {
  constructor(private readonly updateCartUseCase: IUpdateCartUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      await this.updateCartUseCase.update(
        httpRequest.body.increment,
        httpRequest.body.decrement,
        httpRequest.body.promoCode
      )
      return noContent()
    } catch (error: any) {
      return serverError(error)
    }
  }
}
