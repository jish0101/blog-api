import handler from 'express-async-handler';
import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
export const imageUpload = multer({ storage });

export const validateImage = handler(async (req, res, next) => {
  const allowedMimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
  let { mimetype, size } = req.file;

  if (!allowedMimeTypes.includes(mimetype)) {
    throw Error('Image is not valid.');
  }
  if (size > 1 * 1024 * 1024) {
    throw Error('Image is too large.');
  }

  next();
});
