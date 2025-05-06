import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const likeSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    review: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
      required: [true, 'Review is required'],
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      default: 'like',
    },
    status: {
      type: String,
      enum: ['active', 'removed'],
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

likeSchema.index({ review: 1, user: 1 }, { unique: true });
likeSchema.index({ created_at: -1 });

likeSchema.pre('save', async function (next) {
  if (this.isNew) {
    const Review = mongoose.model('Review');
    await Review.findByIdAndUpdate(this.review, { $inc: { likes: 1 } });
  }
  next();
});

likeSchema.pre('remove', async function () {
  const Review = mongoose.model('Review');
  await Review.findByIdAndUpdate(this.review, { $inc: { likes: -1 } });
});

likeSchema.methods.toggle = async function () {
  this.type = this.type === 'like' ? 'dislike' : 'like';
  return this.save();
};

likeSchema.methods.remove = async function () {
  this.status = 'removed';
  return this.save();
};

export default mongoose.model('Like', likeSchema);
