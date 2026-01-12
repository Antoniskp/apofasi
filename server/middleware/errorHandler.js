/**
 * Error handling middleware
 */

import * as Sentry from '@sentry/node';

/**
 * Global error handler middleware
 * Must be registered after all routes
 * @param {Error} err - Error object
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('[error-handler]', err);

  // Sentry error ID is attached to res.sentry
  const errorId = res.sentry;
  
  // Default error response
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(errorId && { errorId })
  });
};

/**
 * Setup Sentry error handlers
 * @param {Object} app - Express app instance
 */
export const setupSentryHandlers = (app) => {
  // The Sentry request handler must be first
  app.use(Sentry.setupExpressErrorHandler);
  
  // The Sentry error handler must be before other error middleware
  app.use(Sentry.expressErrorHandler());
};

/**
 * Request logging middleware for debugging
 * @param {Object} req - Express request
 * @param {Object} res - Express response
 * @param {Function} next - Express next function
 */
export const requestLogger = (req, res, next) => {
  const safeBody =
    req.method !== 'GET' && req.body
      ? {
          ...req.body,
          password: req.body.password ? '<redacted>' : undefined,
        }
      : undefined;

  console.log(
    `[request] ${req.method} ${req.originalUrl} (origin: ${req.headers.origin || 'n/a'})`,
    safeBody ? { body: safeBody } : {}
  );

  next();
};
