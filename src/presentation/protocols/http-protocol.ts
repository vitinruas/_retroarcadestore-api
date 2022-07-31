export interface IHttpRequest {
  headers?: any
  body?: any
  file?: any
  files?: any
  ip?: any
  route?: any
}

export interface IHttpResponse {
  statusCode: number
  body: any
}
