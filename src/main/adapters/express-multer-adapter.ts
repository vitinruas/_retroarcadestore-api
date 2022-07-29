import { upload } from '../middlewares/multer/multer-middleware'
import { NextFunction, Request, Response } from 'express'
import { InvalidProvidedFileError } from '../errors/invalid-provided-file-error'

export const expressMulterAdapter = () => {
  return (request: Request, response: Response, next: NextFunction) => {
    const oldBody = request.body
    const currentUpload = upload.single('photo')

    currentUpload(request, response, (err) => {
      if (err instanceof InvalidProvidedFileError) {
        return response.status(400).json('The provided file is invalid!')
      } else {
        request.body = Object.assign({}, request.body, {
          ...request.body,
          ...oldBody
        })
        return next()
      }
    })
  }
}
