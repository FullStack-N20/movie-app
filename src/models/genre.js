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

genreSchema.index({ name: 'text' });
genreSchema.index({ slug: 1 });
genreSchema.index({ created_at: -1 });

genreSchema.virtual('movies', {
  ref: 'Movie',
  localField: '_id',
  foreignField: 'genres',
});

genreSchema.virtual('subgenres', {
  ref: 'Genre',
  localField: '_id',
  foreignField: 'parent',
});

genreSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

genreSchema.methods.getMovieCount = async function () {
  const Movie = mongoose.model('Movie');
  return Movie.countDocuments({ genres: this._id });
};

genreSchema.methods.getSubgenreCount = async function () {
  return mongoose.model('Genre').countDocuments({ parent: this._id });
};

export default mongoose.model('Genre', genreSchema);
