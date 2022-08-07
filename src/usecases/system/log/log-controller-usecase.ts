import { ILogControllerUseCase } from '../../../domain/usecases/system/log/log-controller-usecase'
import { IHttpRequest, IHttpResponse } from '../../../presentation/protocols'
import {
  IGeoAdapter,
  IGeoEntitie
} from '../../protocols/repository/system/geo-adapter-protocol'
import {
  ILogModel,
  ILogRepository
} from '../../protocols/repository/system/log-repository-protocol'

export class LogControllerUseCase implements ILogControllerUseCase {
  constructor(
    private readonly logRepository: ILogRepository,
    private readonly geoAdapter: IGeoAdapter
  ) {}

  async log(request: IHttpRequest, response: IHttpResponse): Promise<void> {
    const geoData: IGeoEntitie = await this.geoAdapter.lookup(request.ip)
    const logData: ILogModel = Object.assign({
      request,
      response,
      geoInformations: geoData
    })

    // remove all password related data
    delete logData.request.body.password
    delete logData.request.body.passwordConfirmation
    delete logData.request.body.newPassword
    delete logData.request.body.newPasswordConfirmation

    await this.logRepository.log(logData)
  }
}
