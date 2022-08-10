import { noContent, ok } from '../../../helpers/http-response-helper'
import {
  IController,
  IGetProductUseCase,
  IHttpRequest,
  IHttpResponse,
  IProductEntitie
} from './get-product-controller-protocols'

export class GetProductController implements IController {
  constructor(private readonly getProductUseCase: IGetProductUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const product: IProductEntitie | null = await this.getProductUseCase.get(
      httpRequest.body.pid
    )
    if (!product) {
      return noContent()
    }
    return Promise.resolve(
      ok({
        product
      })
    )
  }
}
