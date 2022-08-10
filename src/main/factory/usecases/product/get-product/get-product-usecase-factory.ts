import { IGetProductUseCase } from "../../../../../domain/usecases/product/get-product-usecase";
import { GetProductRepository } from "../../../../../infra/repository/database/mongodb/product/get-product/get-product-repository";
import { GetProductUseCase } from "../../../../../usecases/product/get-product/get-product-usecase";

export const makeGetProductUseCaseFactory = (): IGetProductUseCase => {
    const getProductRepository = new GetProductRepository();
    const getProductUseCase = new GetProductUseCase(getProductRepository);
    return getProductUseCase;
};
