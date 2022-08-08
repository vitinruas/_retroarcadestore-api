import {
  ILogControllerUseCase,
  ILogRepository,
  IGeoAdapter,
  IHttpRequest,
  IHttpResponse,
  IGeoEntitie,
  ILogModel
} from './log-controller-usecase-protocols'

export class LogControllerUseCase implements ILogControllerUseCase {
  constructor(
    private readonly logRepository: ILogRepository,
    private readonly geoAdapter: IGeoAdapter,
    private readonly fieldsToRemove: string[]
  ) {}

  async log(request: IHttpRequest, response: IHttpResponse): Promise<void> {
    const geoData: IGeoEntitie | null = await this.geoAdapter.lookup(request.ip)
    const logData: ILogModel = Object.assign({
      request,
      response,
      geoInformations: geoData
    })

    if (request.body && response.body) {
      for (const field of this.fieldsToRemove) {
        logData.response.body[field] && delete logData.response.body[field]
        logData.request.body[field] && delete logData.request.body[field]
        logData.request.file && delete logData.request.file
        logData.request.files && delete logData.request.files
      }
    }

    switch (response.statusCode) {
      case 500:
        await this.logRepository.log(logData, 'serverLogErrors')
        break
      case 403:
        await this.logRepository.log(logData, 'forbiddenLogErrors')
        break
      case 401:
        await this.logRepository.log(logData, 'unauthenticatedLogErrors')
        break
      case 200:
        if (['/login', '/signup'].includes(request.route)) {
          await this.logRepository.log(logData, 'accessLogs')
        }
        break
      default:
        break
    }
  }
}
