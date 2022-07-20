import { Express } from 'express'
import { jsonMiddleware } from '../middlewares/body-parser/body-parser-middleware'
export default (app: Express) => {
  app.use(jsonMiddleware())
}
