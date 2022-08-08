import { IGetProductsUseCase } from '../../../../domain/usecases/product/get-products-usecase'
import { ok } from '../../../helpers/http-response-helper'
import { IController, IHttpRequest, IHttpResponse } from '../../../protocols'

export class GetAllProductsController implements IController {
  constructor(private readonly getProducsUseCase: IGetProductsUseCase) {}
  async perform(httpRequest: IHttpRequest): Promise<IHttpResponse> {
    await this.getProducsUseCase.get()
    return Promise.resolve(ok())
  }
}
