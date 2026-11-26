import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

export const getResumeFileKind = (filename = '') => {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.txt') return 'text';
  return null;
};

export const fileFilter = (req, file, cb) => {
  if (getResumeFileKind(file.originalname)) {
    cb(null, true);
  } else {
    const err = new Error('Unsupported file type. Please upload a PDF or .txt resume (.doc and .docx are not supported yet).');
    err.statusCode = 415;
    cb(err, false);
  }
};

export const uploadResume = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter,
});
