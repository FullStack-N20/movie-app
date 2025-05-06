import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movieSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    release_year: { type: Number },
    created_by: { type: String, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: false } }
);

export default mongoose.model('Movie', movieSchema);
