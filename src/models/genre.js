import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const genreSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Genre name is required'],
      unique: true,
      trim: true,
      minlength: [2, 'Genre name must be at least 2 characters long'],
      maxlength: [50, 'Genre name cannot exceed 50 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Genre',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  },
);



export default mongoose.model('Genre', genreSchema);
