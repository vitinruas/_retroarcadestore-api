import { IProductEntitie } from '../../../../domain/entities/product/product-entitie'
import { IGetProductsUseCase } from '../../../../domain/usecases/product/get-products-usecase'
import { noContent, ok } from '../../../helpers/http-response-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../../protocols'

export class GetAllProductsController implements IController {
  constructor(private readonly getProducsUseCase: IGetProductsUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    const products: IProductEntitie | IProductEntitie[] | null =
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
