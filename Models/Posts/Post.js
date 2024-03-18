import mongoose from 'mongoose';
import { statusOptions } from '../../Utils/constants';

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: statusOptions,
      default: statusOptions.active,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model('Post', PostSchema);
export default Post;
