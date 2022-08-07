import { IHttpRequest, IHttpResponse } from '../../../../presentation/protocols'
import { IGeoEntitie } from '../../gathering/geo-adapter-protocol'

export interface ILogModel {
  response: IHttpResponse
  request: IHttpRequest
  geoInformations: IGeoEntitie | null
}

export interface ILogRepository {
  log(logData: ILogModel, logName: string): Promise<void>
}
