import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email'],
    },
    password_hash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    otp: {
      type: String,
      select: false,
    },
    otp_expiry: {
      type: Date,
      select: false,
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    last_login: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    toJSON: {
      transform: (_, ret) => {
        delete ret.password_hash;
        delete ret.otp;
        delete ret.otp_expiry;
        return ret;
      },
    },
  }
);

userSchema.index({ email: 1 });
userSchema.index({ created_at: -1 });

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

userSchema.methods.updateLastLogin = async function () {
  this.last_login = new Date();
  return this.save();
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('User', userSchema);
