import mongoHelper from '../infra/repository/database/mongodb/helpers/mongo-helper'
import app from './config/app'
import env from './config/env'

app.listen(env.port, () => {
  mongoHelper
    .connect(env.mongoURL)
    .then(() => {
      console.log('-> Connected to DataBase')
    })
    .catch((error) => {
      console.log('# Error connecting to Database: ', error)
    })
    .finally(() => {
      console.log('-> Server is running at https://localhost:5000')
    })
})
