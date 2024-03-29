import mongoose from 'mongoose';
import {
  OTP_TYPES,
  rolesOptions,
  statusOptions,
} from '../../Utils/constants.js';
import config from '../../Utils/config.js';
import { getOTP } from '../../Middlerwares/otpHandler.js';
import bcrypt from 'bcrypt';
import { sendEmail, templateList } from '../../Utils/emailService.js';
import {
  cloudinaryUploader,
  uploadDirectory,
} from '../../Config/cloudinaryService.js';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    isVerified: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
  },
  otp: {
    otpType: {
      type: String,
      enum: Object.values(OTP_TYPES),
    },
    value: {
      type: String,
    },
    addedAt: {
      type: Date,
      default: Date.now,
    },
    expiredAt: {
      type: Number,
      default: Date.now() + 10 * 60 * 1000,
    },
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(statusOptions),
    default: statusOptions.active,
  },
  role: {
    type: String,
    enum: Object.values(rolesOptions),
    default: rolesOptions.user,
  },
  profile: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  try {
    const existingUser = await User.findOne({
      _id: { $ne: this._id },
      'email.value': this.email.value,
      status: { $nin: [statusOptions.inactive, statusOptions.deleted] },
    });

    if (this.isModified('email')) {
      if (existingUser) {
        next(new Error('User already exists :('));
      } else {
        // We need to send otp when user email is changed.
        const otp = getOTP(OTP_TYPES['email-verification']);
        this.otp = otp;
        await sendEmail(this.email.value, templateList.otp, { otp: otp.value });
      }
    }

    // update profile if account is created or profile is updated.
    if (this.isModified('profile')) {
      const { getDirectory, profile } = uploadDirectory;
      const { secure_url: profileUrl } = await cloudinaryUploader({
        filePath: this.profile,
        directory: getDirectory(this.email.value, profile),
      });
      this.profile = profileUrl;
    }

    if (this.isModified('password')) {
      const salt = await bcrypt.genSalt(parseInt(config.SALT_WORK, 10));
      const hash = bcrypt.hashSync(this.password, salt);
      this.password = hash;
    }

    next();
  } catch (error) {
    console.log('pre-save-error: ', error);
    next(error);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
