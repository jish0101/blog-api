import multer from 'multer';
import sharp from 'sharp';
import handler from 'express-async-handler';

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

export const transFormImage = async (file) => {
  try {
    return sharp(file.buffer)
      .resize(350, 350, {
        fit: sharp.fit.contain,
      })
      .toFormat('jpeg')
      .toBuffer();
  } catch (error) {
    console.log(error);
    return error;
  }
};
