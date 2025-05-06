import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const movieSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [1, 'Title must be at least 1 character long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    release_year: {
      type: Number,
      min: [1888, 'Release year cannot be before 1888'],
      max: [
        new Date().getFullYear() + 5,
        'Release year cannot be more than 5 years in the future',
      ],
    },
    duration: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      max: [600, 'Duration cannot exceed 600 minutes'],
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [10, 'Rating cannot exceed 10'],
      default: 0,
    },
    genres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Genre',
      },
    ],
    poster_url: {
      type: String,
      match: [/^https?:\/\/.+/, 'Poster URL must be a valid URL'],
    },
    trailer_url: {
      type: String,
      match: [/^https?:\/\/.+/, 'Trailer URL must be a valid URL'],
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

movieSchema.index({ title: 'text', description: 'text' });
movieSchema.index({ release_year: -1 });
movieSchema.index({ rating: -1 });
movieSchema.index({ created_at: -1 });

movieSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'movie',
});

movieSchema.virtual('likes', {
  ref: 'Like',
  localField: '_id',
  foreignField: 'movie',
});

movieSchema.methods.updateRating = async function () {
  const reviews = await mongoose.model('Review').find({ movie: this._id });
  if (reviews.length === 0) return;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  this.rating = totalRating / reviews.length;
  return this.save();
};

export default mongoose.model('Movie', movieSchema);
