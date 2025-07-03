import fs from 'fs'
import path from 'path'
import multer from 'multer'


function diskStorage() {

    return multer.diskStorage({
        destination(req, file, callback) {
            const now = Date.now()
            const dt = new Date(now)
            const storePath = path.join('public', String(dt.getFullYear()), String(dt.getMonth()), String(dt.getDate()))

            file.originalname = now + '-' + file.originalname
            if (!fs.existsSync(storePath))
                fs.mkdirSync(storePath, { recursive: true })
            callback(null, storePath)
        },
        filename(req, file, callback) {
            callback(null, file.originalname)
        },
    })
}

/// List of image mimetypes: https://www.iana.org/assignments/media-types/media-types.xhtml#image
const imgMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']

export const multerMw = multer({
    storage: diskStorage(),
    fileFilter(req, file, callback) {
        if (imgMimeTypes.includes(file.mimetype))
            callback(null, true)
        else
            callback(null, false)
    },
}).array('files', 5)

