import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const adminSchema = new mongoose.Schema(
  {
    id: { 
      type: String, 
      default: uuidv4, 
      unique: true,
      index: true 
    },
    username: { 
      type: String, 
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores and hyphens']
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email']
    },
    password_hash: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters long']
    },
    role: {
      type: String,
      enum: ['admin', 'super_admin'],
      default: 'admin'
    },
    permissions: [{
      type: String,
      enum: [
        'manage_users',
        'manage_movies',
        'manage_reviews',
        'manage_genres',
        'manage_admins'
      ]
    }],
    last_login: {
      type: Date
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'suspended'],
      default: 'active'
    },
    failed_login_attempts: {
      type: Number,
      default: 0
    },
    lock_until: {
      type: Date
    }
  },
  { 
    timestamps: { 
      createdAt: 'created_at', 
      updatedAt: 'updated_at' 
    },
    toJSON: {
      transform: (_, ret) => {
        delete ret.password_hash;
        delete ret.failed_login_attempts;
        delete ret.lock_until;
        return ret;
      }
    }
  }
);

adminSchema.index({ email: 1 });
adminSchema.index({ username: 1 });
adminSchema.index({ created_at: -1 });

adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

adminSchema.methods.updateLastLogin = async function() {
  this.last_login = new Date();
  this.failed_login_attempts = 0;
  this.lock_until = undefined;
  return this.save();
};

adminSchema.methods.incrementFailedLoginAttempts = async function() {
  this.failed_login_attempts += 1;
  if (this.failed_login_attempts >= 5) {
    this.lock_until = new Date(Date.now() + 30 * 60 * 1000); // Lock for 30 minutes
  }
  return this.save();
};

adminSchema.pre('save', async function(next) {
  if (!this.isModified('password_hash')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Admin', adminSchema);
