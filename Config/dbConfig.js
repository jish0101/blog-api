import mongoose from 'mongoose';
import config from '../Utils/config.js';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
  } catch (error) {
    console.log(error);
  }
};
