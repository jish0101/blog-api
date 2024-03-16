import asyncHandler from 'express-async-handler';
import { randomInt } from 'crypto';
import User from '../Models/User/User.js';
import config from '../Utils/config.js';
import { sendEmail, templateList } from '../Utils/emailService.js';
import { OTP_TYPES } from '../Utils/constants.js';

const getOTP = (otpType) => {
  const value = randomInt(100000, 1000000);
  return { value, otpType };
};

export const validateOTP = (type) =>
  asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    if (!otp) {
      res.status(400);
      throw new Error('No OTP Provided!');
    }

    if (!email) {
      res.status(400);
      throw new Error('Provide Email!');
    }

    const existingUser = await User.findOne({ 'email.value': email }).lean();

    if (!existingUser) {
      res.status(404);
      throw new Error('No user found with this email!');
    }

    if (existingUser?.otp?.value === otp) {
      if (type !== existingUser.otp?.otpType) {
        res.status(400);
        throw new Error('Invalid Action!');
      }
      if (Date.now() > existingUser.otp?.expiredAt) {
        throw new Error('OTP has been expired!');
      }
      // marking token used
      await User.findOneAndUpdate(
        { 'email.value': email },
        { otp: {}, email: { ...existingUser.email, isVerified: true } },
      );
      return next();
    }
    res.status(400);
    throw new Error('Invalid OTP!');
  });

export const requestOTP = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const { type } = req.query;
  const newOtp = getOTP(type ?? OTP_TYPES['email-verification'], 10);

  if (email && type) {
    if (OTP_TYPES[type]) {
      // check if last sent otp was more than 2 min ago
      const foundUser = await User.findOne({ email }).lean();
      const currentTimestamp = Date.now();
      const twoMinutes = parseInt(config.OTP_RESEND_DELAY) * 60 * 1000;

      if (foundUser) {
        if (foundUser.otp && foundUser.otp.otpType === type) {
          const addedAt = foundUser.otp.addedAt;
          const timeElapsed = currentTimestamp - addedAt;
          // if type of otp requested is already sent to user only then check if 2 min past or not;
          // sent time left before user can request again
          if (timeElapsed < twoMinutes) {
            const remainingTime = Math.ceil(
              (twoMinutes - timeElapsed) / (60 * 1000),
            );
            throw new Error(
              `Before requesting for another otp, wait for ${remainingTime} min(s).`,
            );
          }
        }

        // Saving user with new otp;
        foundUser.otp = newOtp;
        await foundUser.save();

        const isOTPSent = await sendEmail(email, templateList?.otp?.name, {
          otp: newOtp.value,
        });
        if (!isOTPSent) {
          throw new Error('Error in sending otp.');
        }
        return res.json({
          status: true,
          message: `Otp successfully sent to user email`,
        });
      }
      throw new Error('No user found with this email!');
    }
    throw new Error('Invalid type of otp request');
  }
  if (!type && newOtp) {
    // Case when user creates account
    req.body.otp = newOtp;
    return next();
  }
  throw new Error('Failed to generate otp.');
});
