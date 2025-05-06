import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const likeSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    review_id: { type: String, ref: 'Review', required: true },
    user_id: { type: String, ref: 'User', required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

likeSchema.index({ review_id: 1, user_id: 1 }, { unique: true });

export default mongoose.model('Like', likeSchema);
