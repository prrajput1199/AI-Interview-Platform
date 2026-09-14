import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { env } from '@/config/env'
import { BadRequestError } from '@/utils/errors'

const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR, 'resumes')
fs.mkdirSync(uploadRoot, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf'
    cb(null, `${randomUUID()}${ext}`)
  },
})

function pdfFileFilter(
  _req: unknown,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const isPdfMime = file.mimetype === 'application/pdf'
  const isPdfExt = path.extname(file.originalname).toLowerCase() === '.pdf'

  if (!isPdfMime || !isPdfExt) {
    cb(new BadRequestError('Only PDF files are accepted', 'INVALID_FILE_TYPE'))
    return
  }
  cb(null, true)
}

export const uploadResume = multer({
  storage,
  fileFilter: pdfFileFilter,
  limits: {
    fileSize: env.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
    files: 1,
  },
}).single('resume')
