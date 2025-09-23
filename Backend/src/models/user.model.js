import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // optional for Google OAuth users
    },
    mobile: {
      type: String,
      trim: true,
    },
    provider: {
      type: String,
      enum: ['local', 'google', 'both'],
      default: 'local',
    },
    avatar: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female'],
    },
    dob: {
      type: Date,
    },
    alternateMobile: {
      type: String,
      trim: true,
    },
    refreshToken: {
      type: String,
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
    // Removed forms array; forms reference the user via userId in Form model
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// JWT access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '1d',
    }
  );
};

// JWT refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '10d',
    }
  );
};

export const User = mongoose.model('User', UserSchema);