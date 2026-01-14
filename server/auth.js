/**
 * Authentication utilities
 * JWT token generation, validation, and refresh logic
 */

const jwt = require('jsonwebtoken');
const config = require('./config');
const logger = require('./logger');

const generateTokens = (userId, role = 'admin') => {
  try {
    const accessToken = jwt.sign({ userId, role }, config.JWT.SECRET, {
      expiresIn: config.JWT.EXPIRY,
    });

    const refreshToken = jwt.sign({ userId, role }, config.JWT.REFRESH_SECRET, {
      expiresIn: config.JWT.REFRESH_EXPIRY,
    });

    return { accessToken, refreshToken };
  } catch (error) {
    logger.error('Token generation failed', { error: error.message });
    throw error;
  }
};

const verifyAccessToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT.SECRET);
    return { valid: true, decoded };
  } catch (error) {
    logger.warn('Access token verification failed', { error: error.message });
    return { valid: false, decoded: null };
  }
};

const verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, config.JWT.REFRESH_SECRET);
    return { valid: true, decoded };
  } catch (error) {
    logger.warn('Refresh token verification failed', { error: error.message });
    return { valid: false, decoded: null };
  }
};

const authenticateRequest = (req, res, next) => {
  // Extract token from Authorization header or cookies
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const { valid, decoded } = verifyAccessToken(token);
  if (!valid) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Attach user info to request
  req.user = decoded;
  next();
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    logger.warn('Unauthorized admin access attempt', { userId: req.user?.userId });
    return res.status(403).json({ message: 'Admin role required' });
  }
  next();
};

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  authenticateRequest,
  requireAdmin,
};
