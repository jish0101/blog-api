import { v2 as cloudinary } from 'cloudinary';
import config from '../Utils/config.js';

cloudinary.config({
  cloud_name: config.CLOUDINARY_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SEC,
  secure: true,
});

export const uploadDirectory = {
  profile: 'profile',
  posts: 'posts',
  getDirectory: function (userName, dirName) {
    return `blog/users/${userName}/${dirName}`;
  },
};

export const cloudinaryUploader = async ({ filePath, directory }) => {
  try {
    if (filePath && directory) {
      const fileObj = await cloudinary.uploader.upload(filePath, {
        folder: directory,
        use_filename: true,
      });
      return fileObj;
    }
    throw new Error(`Server error`);
  } catch (error) {
    console.error(error);
  }
};
