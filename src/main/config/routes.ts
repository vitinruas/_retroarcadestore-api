import { Express, Router } from 'express'
import FastGlob from 'fast-glob'
export default (app: Express) => {
  const router = Router()
  app.use('/api', router)
  FastGlob.sync('**/*route.ts').map(async (file) =>
    (await import('../../../' + file)).default(router)
  )
}
