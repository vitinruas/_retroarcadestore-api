import {
  IGetClientUseCase,
  IGetClientModel,
  IGetClientByUIDRepository
} from './get-client-usecase-protocols'

export class GetClientUseCase implements IGetClientUseCase {
  constructor(
    private readonly getClientByUIDRepository: IGetClientByUIDRepository
  ) {}

  async get(uid: string): Promise<IGetClientModel> {
    const account: IGetClientModel = await this.getClientByUIDRepository.get(
      uid
    )
    return account
  }
}
