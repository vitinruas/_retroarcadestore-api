export interface IHttpRequest {
  ip: string
  route: string
  headers: any
  body?: any
  file?: any
  files?: any
}

export interface IHttpResponse {
  statusCode: number
  body: any
}
