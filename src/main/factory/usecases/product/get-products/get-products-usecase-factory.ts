import { IGetProductsUseCase } from '../../../../../domain/usecases/product/get-products-usecase'
import { GetProductsRepository } from '../../../../../infra/repository/database/mongodb/product/get-products/get-products-repository'
import { GetProductsUseCase } from '../../../../../usecases/product/get-products/get-products-usecase'

export const makeGetProductsUseCaseFactory = (): IGetProductsUseCase => {
  const getProductsRepository = new GetProductsRepository()
  const getProductsUseCase = new GetProductsUseCase(getProductsRepository)
  return getProductsUseCase
}
