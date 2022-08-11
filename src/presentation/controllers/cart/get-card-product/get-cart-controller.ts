import { ICartEntitie } from '../../../../domain/entities/cart/cart-entitie'
import { IGetCartUseCase } from '../../../../domain/usecases/cart/get-cart-usecase'
import {
  noContent,
  ok,
  serverError
} from '../../../helpers/http-response-helper'
import {
  IController,
  IHttpRequest,
  IHttpResponse
} from './get-cart-controller-protocols'

export class GetCartController implements IController {
  constructor(private readonly getCartUseCase: IGetCartUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      const cart: ICartEntitie | null = await this.getCartUseCase.get(
        httpRequest.body.uid
      )
      if (!cart) {
        return noContent()
      }
      return ok(cart)
    } catch (error: any) {
      return serverError(error)
    }
  }
}
