import handler from 'express-async-handler';
import User from '../../Models/User/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { statusOptions } from '../../Utils/constants.js';
import config from '../../Utils/config.js';
import {
  cloudinaryUploader,
  uploadDirectory,
} from '../../Config/cloudinaryService.js';
import { fileToURL } from '../../Utils/utility.js';
import { transFormImage } from '../../Middlerwares/fileUploader.js';

export const createUser = handler(async (req, res) => {
  const { name, email, password } = req.body;
  const imageBuffer = await transFormImage(req.file);
  const filePath = fileToURL(imageBuffer);

  await User.create({
    name: name,
    email: {
      value: email,
    },
    profile: filePath,
    password: password,
  });

  return res.json({
    status: true,
    message: `User is created!`,
  });
});

export const updateUser = handler(async (req, res) => {
  const { _id } = req.user;
  const { name, email } = req.body;
  const file = req.file;

  const user = await User.findById(_id);

  if (!user) {
    throw new Error('Server Error');
  }

  if (file) {
    const imageBuffer = await transFormImage(req.file);
    const filePath = fileToURL(imageBuffer);
    user.profile = filePath;
  }

  user.name = name;
  user.email = email;

  await user.save();

  res.json({
    status: true,
    message: `User is updated ${user.name}`,
  });
});

export const deleteUser = handler(async (req, res) => {
  const { _id } = req.user;

  const deletedUser = await User.findById(_id);

  if (!deletedUser) {
    throw new Error('Server Error');
  }

  deletedUser.status = statusOptions.deleted;

  await deletedUser.save();

  res.json({
    status: true,
    message: `User is deleted ${deletedUser.name}`,
  });
});

export const getAllUsers = handler(async (req, res) => {
  const { page, rowCount, status } = req.query;
  const limit = rowCount ? parseInt(rowCount) : 10;
  const pageNum = page ? parseInt(page, 10) : 1;
  const skip = (pageNum - 1) * limit;

  const query = {
    status: { $nin: [statusOptions.deleted, statusOptions.inactive] },
  };

  if (status) {
    query.status = status;
  }

  const total = await User.countDocuments(query);
  const users = await User.find(query).limit(limit).skip(skip);

  res.json({
    status: true,
    message: `All users`,
    data: {
      users,
      pagination: {
        page: pageNum,
        rowCount: limit,
        total,
      },
    },
  });
});

export const loginUser = handler(async (req, res) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ 'email.value': email }).lean();

  if (!foundUser) {
    throw new Error(`User not found with email ${email}`);
  }

  if (!foundUser.email.isVerified) {
    throw new Error('Please verify your email');
  }

  const isMatch = await bcrypt.compare(password, foundUser.password);

  if (isMatch === true) {
    const { password, refreshToken, otp, ...payload } = foundUser;
    const newAccessToken = jwt.sign(payload, config.ACCESSTOKENSEC);
    const newRefreshToken = jwt.sign(payload, config.REFRESH_TOKEN_SEC);

    const updatedUser = await User.findByIdAndUpdate(foundUser._id, {
      refreshToken: newRefreshToken,
    }).lean();

    if (updatedUser) {
      res.cookie('jwt', newRefreshToken, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        status: true,
        message: `${updatedUser.name} is logged in`,
        data: {
          ...payload,
          email,
          token: newAccessToken,
        },
      });
    }
  } else {
    throw new Error('Invalid credentials');
  }
});

export const getRefreshToken = handler(async (req, res) => {
  const { cookies } = req;
  const refreshToken = cookies?.jwt;

  if (!refreshToken) {
    res.status(403);
    throw new Error(`No refresh token found`);
  }

  const foundUser = await User.findOne({ refreshToken }).lean();

  if (!foundUser) {
    res.status(403);
    throw new Error(`No user found provided token`);
  }

  return jwt.verify(refreshToken, config.REFRESH_TOKEN_SEC, (err, decoded) => {
    if (err || decoded._id !== foundUser._id) {
      res.status(403);
      throw new Error(`Invalid refresh token`);
    }
    const { password, refreshToken, otp, ...payload } = foundUser;

    const token = jwt.sign(payload, config.ACCESSTOKENSEC);

    return res.json({
      status: true,
      message: `Token refresh successful`,
      data: {
        ...payload,
        token,
      },
    });
  });
});
