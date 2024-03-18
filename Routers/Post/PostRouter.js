import express from 'express';
import { imageUpload, validateImage } from '../../Middlerwares/fileUploader.js';
import { postCreateValidation } from '../../Models/Posts/postValidation.js';
import { schemaValidator } from '../../Middlerwares/schemaValidator.js';
import {
  createPost,
  updatePost,
  getPosts,
  deletePost,
} from '../../Controllers/Post/PostController.js';

const router = express.Router();

router.post('/', postCreateValidation, schemaValidator, createPost);
router.put('/', updatePost);
router.get('/', getPosts);
router.delete('/', deletePost);

export default router;
