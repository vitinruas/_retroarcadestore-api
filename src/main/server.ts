import mongoHelper from '../infra/repository/database/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'

mongoHelper
  .connect(env.mongoURL)
  .then(() => {
    console.log('-> Connected to DataBase')
    app.listen(env.port, () => {
      console.log('-> Server is running at https://localhost:5000')
    })
  })
  .catch((error) => {
    console.log('# Error connecting to Database: ', error)
  })
  .finally(() => {
    console.log('API: Ok!')
  })
