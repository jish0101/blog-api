import express from 'express';
import {
  createUser,
  deleteUser,
  getAllUsers,
  getRefreshToken,
  loginUser,
  updateUser,
} from '../../Controllers/Users/UsersController.js';
import { schemaValidator } from '../../Middlerwares/schemaValidator.js';
import {
  userEmailValidation,
  userOtpReqValidation,
  userValidationGet,
  userValidatonSchema,
  userValidatonSchemaPut,
} from '../../Models/User/userValidationSchema.js';
import { verifyAuth } from '../../Middlerwares/verifyAuth.js';
import { requestOTP, validateOTP } from '../../Middlerwares/otpHandler.js';
import { OTP_TYPES } from '../../Utils/constants.js';
import { imageUpload, validateImage } from '../../Middlerwares/fileUploader.js';

const router = express.Router();

router
  .route('/')
  .post(
    // userValidatonSchema,
    // schemaValidator,
    imageUpload.single('profile'),
    validateImage,
    createUser,
  )
  .get(verifyAuth, userValidationGet, schemaValidator, getAllUsers)
  .put(verifyAuth, userValidatonSchemaPut, schemaValidator, updateUser)
  .delete(verifyAuth, deleteUser);

// Auth related methods
router.post(
  '/verify-email',
  userEmailValidation,
  schemaValidator,
  validateOTP(OTP_TYPES['email-verification']),
  (req, res) => {
    res.json({ status: true, message: 'Users email is verified.' });
  },
);

router.post('/request-otp', userOtpReqValidation, schemaValidator, requestOTP);
router.post('/login', loginUser);
router.get('/refresh', getRefreshToken);

export default router;
