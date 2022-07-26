import { upload } from '../middlewares/multer/multer-middleware'
import { NextFunction, Request, Response } from 'express'
import { InvalidProvidedFileError } from '../errors/invalid-provided-file-error'

export default (fieldName: string) => {
  return (request: Request, response: Response, next: NextFunction) => {
    const currentUpload = upload.single('photo')

    currentUpload(request, response, (err) => {
      if (err instanceof InvalidProvidedFileError) {
        return response.status(400).json('The provided file is invalid!')
      } else {
        return next()
      }
    })
  }
}
