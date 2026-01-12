/**
 * Authentication and authorization middleware
 */

import { ERROR_MESSAGES } from '../constants/index.js';

/**
 * Ensure user is authenticated
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const ensureAuthenticated = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: ERROR_MESSAGES.AUTH_REQUIRED });
  }
  return next();
};

/**
 * Ensure user has one of the required roles
 * @param {...string} roles - Required roles
 * @returns {Function} Express middleware
 */
export const ensureRole = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: ERROR_MESSAGES.AUTH_REQUIRED });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: ERROR_MESSAGES.INSUFFICIENT_PERMISSIONS });
  }

  return next();
};

/**
 * Ensure OAuth provider is configured
 * @param {string} provider - Provider name (google, facebook, etc.)
 * @returns {Function} Express middleware
 */
export const ensureProviderConfigured = (provider) => (req, res, next) => {
  const oauthProviders = req.app.get('oauthProviders') || {};
  
  if (!oauthProviders[provider]) {
    return res.status(503).json({ 
      message: `${provider} ${ERROR_MESSAGES.PROVIDER_NOT_CONFIGURED}` 
    });
  }
  return next();
};
