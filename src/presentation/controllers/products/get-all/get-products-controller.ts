import { noContent, ok } from '../../../helpers/http-response-helper'
import {
  IController,
  IGetProductsUseCase,
  IHttpRequest,
  IHttpResponse,
  IProductEntitie
} from './get-products-controller-protocol'

export class GetProductsController implements IController {
  constructor(private readonly getProducsUseCase: IGetProductsUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const products: IProductEntitie[] | null =
      await this.getProducsUseCase.get()

    if (!products) {
      return noContent()
    }

    return Promise.resolve(
      ok({
        products
      })
    )
  }
}
