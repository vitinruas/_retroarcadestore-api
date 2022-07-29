export interface IHttpRequest {
  headers?: any
  body?: any
  file?: any
  files?: any
}

export interface IHttpResponse {
  statusCode: number
  body: any
}
