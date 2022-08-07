import { ILogControllerUseCase } from '../../../domain/usecases/system/log/log-controller-usecase'
import { IHttpRequest, IHttpResponse } from '../../../presentation/protocols'
import { IGeoAdapter } from '../../protocols/repository/system/geo-adapter-protocol'

export class LogControllerUseCase implements ILogControllerUseCase {
  constructor(private readonly geoAdapter: IGeoAdapter) {}

  async log(request: IHttpRequest, response: IHttpResponse): Promise<void> {
    await this.geoAdapter.lookup(request.ip)
  }
}
