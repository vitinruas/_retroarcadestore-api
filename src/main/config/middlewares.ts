import { Express } from 'express'
import { jsonMiddleware } from '../middlewares/body-parser/body-parser-middleware'
import { contentTypeMiddleware } from '../middlewares/content-type/content-type-middleware'

export default (app: Express) => {
  app.use(jsonMiddleware())
  app.use(contentTypeMiddleware)
}
