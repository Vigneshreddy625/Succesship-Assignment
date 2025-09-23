import jwt from 'jsonwebtoken'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'

export const issueTokensAndRedirect = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) return res.status(401).json({ success: false, message: 'Authentication failed' })

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, 
    }

    res.cookie('accessToken', accessToken, cookieOptions)
    // Preserve Google flow: we are not storing or returning refresh cookie here

    const redirectUrl = process.env.CLIENT_URL || 'http://localhost:5173'
    const target = `${redirectUrl}/auth/callback`
    return res.redirect(target)
  } catch (err) {
    next(err)
  }
}

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Not authenticated',
        isAuthenticated: false 
      })
    }

    return res.status(200).json({
      success: true,
      message: 'User authenticated',
      isAuthenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.fullName,
        avatar: user.avatar
      }
    })
  } catch (err) {
    next(err)
  }
}

export const logout = async (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })

    // Best-effort: if user attached, clear stored refreshToken
    try {
      const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
      if (token) {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        await User.findByIdAndUpdate(decoded?._id, { $unset: { refreshToken: 1 } })
      }
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    })
  } catch (err) {
    next(err)
  }
}

export const register = async (req, res, next) => {
  try {
    const { fullName, email, password, mobile } = req.body
    if (!fullName || !email || !password) {
      throw new ApiError(400, 'fullName, email, and password are required')
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already in use' })
    }

    const user = await User.create({ fullName, email, password, mobile, provider: 'local' })

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const accessCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    }
    const refreshCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    res.cookie('accessToken', accessToken, accessCookie)
    res.cookie('refreshToken', refreshToken, refreshCookie)

    return res.status(201).json({
      success: true,
      message: 'Registered successfully',
      user: { id: user._id, email: user.email, name: user.fullName, avatar: user.avatar },
    })
  } catch (err) {
    next(err)
  }
}

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      throw new ApiError(400, 'email and password are required')
    }

    const user = await User.findOne({ email })
    if (!user || !user.password) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken
    await user.save({ validateBeforeSave: false })

    const accessCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    }
    const refreshCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    res.cookie('accessToken', accessToken, accessCookie)
    res.cookie('refreshToken', refreshToken, refreshCookie)

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      user: { id: user._id, email: user.email, name: user.fullName, avatar: user.avatar },
    })
  } catch (err) {
    next(err)
  }
}

export const refresh = async (req, res, next) => {
  try {
    const incoming = req.cookies?.refreshToken || req.body?.refreshToken
    if (!incoming) {
      throw new ApiError(401, 'No refresh token provided')
    }

    let decoded
    try {
      decoded = jwt.verify(incoming, process.env.REFRESH_TOKEN_SECRET)
    } catch (e) {
      throw new ApiError(401, 'Invalid refresh token')
    }

    const user = await User.findById(decoded?._id)
    if (!user || !user.refreshToken) {
      throw new ApiError(401, 'Invalid refresh session')
    }

    if (user.refreshToken !== incoming) {
      throw new ApiError(401, 'Refresh token mismatch')
    }

    const newAccessToken = user.generateAccessToken()
    const newRefreshToken = user.generateRefreshToken()

    user.refreshToken = newRefreshToken
    await user.save({ validateBeforeSave: false })

    const accessCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    }
    const refreshCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 24 * 60 * 60 * 1000,
    }

    res.cookie('accessToken', newAccessToken, accessCookie)
    res.cookie('refreshToken', newRefreshToken, refreshCookie)

    return res.status(200).json({ success: true, message: 'Token refreshed' })
  } catch (err) {
    next(err)
  }
}


