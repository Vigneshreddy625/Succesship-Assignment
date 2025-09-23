import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';

export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      req.user = null;
      return next();
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      '-password -refreshToken'
    );

    if (!user) {
      req.user = null;
      return next();
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    req.user = null;
    return next();
  }
};