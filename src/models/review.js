import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const reviewSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      default: uuidv4, 
      unique: true,
      index: true 
    },
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: [true, 'User is required'],
      index: true
    },
    movie: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Movie', 
      required: [true, 'Movie is required'],
      index: true
    },
    content: { 
      type: String, 
      required: [true, 'Review content is required'],
      trim: true,
      minlength: [10, 'Review must be at least 10 characters long'],
      maxlength: [1000, 'Review cannot exceed 1000 characters']
    },
    rating: { 
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [10, 'Rating cannot exceed 10']
    },
    likes: {
      type: Number,
      default: 0,
      min: 0
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    helpful_votes: {
      up: { type: Number, default: 0 },
      down: { type: Number, default: 0 }
    }
  },
  { 
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    },
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

reviewSchema.index({ created_at: -1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ likes: -1 });

reviewSchema.virtual('helpful_score').get(function() {
  return this.helpful_votes.up - this.helpful_votes.down;
});

reviewSchema.methods.markHelpful = async function(vote) {
  if (vote === 'up') {
    this.helpful_votes.up += 1;
  } else if (vote === 'down') {
    this.helpful_votes.down += 1;
  }
  return this.save();
};

reviewSchema.pre('save', async function(next) {
  if (this.isModified('rating')) {
    const Movie = mongoose.model('Movie');
    await Movie.findByIdAndUpdate(this.movie, { $inc: { rating: this.rating } });
  }
  next();
});

reviewSchema.post('remove', async function() {
  const Movie = mongoose.model('Movie');
  await Movie.findByIdAndUpdate(this.movie, { $inc: { rating: -this.rating } });
});

export default mongoose.model('Review', reviewSchema);
