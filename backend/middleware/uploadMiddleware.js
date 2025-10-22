import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = 'uploads'
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir)
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, `${file.fieldname}-${Date.now()}${ext}`)
  },
})

function checkFileType(file, cb) {
  const filetypes = /csv|xlsx/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  if (extname) {
    cb(null, true)
  } else {
    cb(new Error('Hanya file CSV atau XLSX yang diperbolehkan'))
  }
}

const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb)
  },
})

export default upload
