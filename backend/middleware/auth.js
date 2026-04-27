import User from '../models/User.js';
import { verifyAccessToken, verifyRefreshToken, generateTokens, setTokenCookies } from '../utils/jwt.js';

// Protect routes - require authentication
export const protect = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    // Try to verify access token
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded) {
        const user = await User.findById(decoded.id);
        console.log('User found in protect middleware:', user);
        if (user) {
          req.user = user;
          return next();
        }
      }
    }

    // Access token invalid/expired, try refresh token
    if (refreshToken) {
      const decoded = verifyRefreshToken(refreshToken);
      if (decoded) {
        const user = await User.findById(decoded.id);
        if (user && user.refreshToken === refreshToken) {
          // Generate new tokens
          const tokens = generateTokens(user._id);
          user.refreshToken = tokens.refreshToken;
          await user.save();

          // Set new cookies
          setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

          req.user = user;
          return next();
        }
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized, please login'
    });
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Not authorized'
    });
  }
};

// Admin only middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin only.'
    });
  }
};

// Optional auth - attach user if token exists but don't require it
export const optionalAuth = async (req, res, next) => {
  console.log("OPTIONAL AUTH HIT");
  console.log("COOKIES:", req.cookies);
  try {
    const accessToken = req.cookies.accessToken;
    if (accessToken) {
      const decoded = verifyAccessToken(accessToken);
      if (decoded) {
        const user = await User.findById(decoded.id);
        console.log('User found in optionalAuth middleware:', user);
        if (user) {
          req.user = user;
        }
      }
    }
    next();
  } catch (error) {
    next();
  }
};
