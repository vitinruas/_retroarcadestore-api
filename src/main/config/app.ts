import express from 'express'
import makeMiddlewares from './middlewares'
import makeRoutes from './routes'

const app = express()
makeMiddlewares(app)
makeRoutes(app)

export default app
