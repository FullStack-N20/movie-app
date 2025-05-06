import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const reviewSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    user_id: { type: String, ref: 'User', required: true },
    movie_id: { type: String, ref: 'Movie', required: true },
    content: { type: String, required: true },
    rating: { type: Number },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('Review', reviewSchema);
