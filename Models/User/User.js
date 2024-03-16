import mongoose from 'mongoose';
import {
  OTP_TYPES,
  rolesOptions,
  statusOptions,
} from '../../Utils/constants.js';

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
      required: true,
    },
    value: {
      type: String,
      required: true,
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
  refreshToken: {
    type: String,
  },
});

userSchema.pre('save', async function (next) {
  const user = await User.findOne({
    _id: { $ne: this._id },
    email: this.email,
    status: { $nin: [statusOptions.inactive, statusOptions.deleted] },
  });
  if (user) {
    next(new Error('User already exists :('));
  }
  next();
});

const User = mongoose.model('User', userSchema);

export default User;
