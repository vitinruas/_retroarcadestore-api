import multer from 'multer'
import { InvalidProvidedFileError } from '../../errors/invalid-provided-file-error'

const getFileExtension = (originalName: string) => {
  const extension = originalName.split('.')[1]
  return extension.toLowerCase()
}

const storage = multer.diskStorage({
  destination: function (request, file, callback) {
    if (file.fieldname === 'photo') {
      callback(null, 'public/uploads/client')
    } else {
      callback(null, 'public/uploads/client')
    }
  },
  filename: function (request, file, callback) {
    callback(
      null,
      `${file.fieldname}-${Date.now()}.${getFileExtension(file.originalname)}`
    )
  }
})

const upload = multer({
  storage,
  fileFilter(req, file, callback) {
    const acceptedExtensions = ['jpg', 'png']

    if (acceptedExtensions.includes(getFileExtension(file.originalname))) {
      return callback(null, true)
    }
    return callback(new InvalidProvidedFileError())
  }
})

export { multer, upload }
