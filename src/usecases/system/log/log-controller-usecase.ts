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
    private readonly geoAdapter: IGeoAdapter
  ) {}

  async log(request: IHttpRequest, response: IHttpResponse): Promise<void> {
    const geoData: IGeoEntitie | null = await this.geoAdapter.lookup(request.ip)
    const logData: ILogModel = Object.assign({
      request,
      response,
      geoInformations: geoData
    })

    if (request.body && response.body) {
      // remove all sensive data
      const sensiveField = [
        'password',
        'passwordConfirmation',
        'newPassword',
        'newPasswordConfirmation',
        'accessToken'
      ]

      for (const field of sensiveField) {
        logData.response.body[field] && delete logData.response.body[field]
        logData.request.body[field] && delete logData.request.body[field]
        logData.request.file && delete logData.request.file
        logData.request.files && delete logData.request.files
      }
    }

    if (response.statusCode === 500) {
      await this.logRepository.log(logData, 'serverLogErrors')
    } else if (response.statusCode === 401) {
      await this.logRepository.log(logData, 'unauthenticatedLogErrors')
    } else if (response.statusCode === 403) {
      await this.logRepository.log(logData, 'forbiddenLogErrors')
    } else if (
      (response.statusCode === 200 && request.route === '/login') ||
      (response.statusCode === 200 && request.route === '/signup')
    ) {
      await this.logRepository.log(logData, 'accessLogs')
    }
  }
}
