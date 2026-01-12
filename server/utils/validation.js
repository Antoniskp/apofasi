/**
 * Validation utilities
 * Common validation functions used throughout the application
 */

/**
 * Escape special regex characters in a string to prevent regex injection
 * @param {string} value - The string to escape
 * @returns {string} The escaped string safe for use in regex
 */
export const escapeRegex = (value = '') => {
  const pattern = /[.*+?^${}()|[\]\\]/g;
  return value.replace(pattern, '\\$&');
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validate image format (base64 data URL)
 * @param {string} imageData - Base64 data URL
 * @returns {Object|null} Object with mime type and buffer, or null if invalid
 */
export const validateImageFormat = (imageData) => {
  if (!imageData || typeof imageData !== 'string') return null;
  
  const match = imageData.match(/^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!match) return null;
  
  return {
    mimeType: match[1],
    buffer: Buffer.from(match[2], 'base64')
  };
};

/**
 * Normalize and deduplicate array of strings
 * @param {Array|string} input - Array or comma-separated string
 * @param {number} maxItems - Maximum number of items to return
 * @returns {Array<string>} Array of unique, trimmed, non-empty strings
 */
export const normalizeStringArray = (input, maxItems = Infinity) => {
  const items = Array.isArray(input)
    ? input
    : typeof input === 'string'
      ? input.split(',')
      : [];

  const normalized = items
    .map(item => typeof item === 'string' ? item.trim() : '')
    .filter(Boolean);

  return Array.from(new Set(normalized)).slice(0, maxItems);
};

/**
 * Sanitize user object for client response
 * @param {Object} user - User object from database
 * @returns {Object|null} Sanitized user object safe for client
 */
export const sanitizeUser = (user) =>
  user
    ? {
        id: user.id,
        displayName: user.displayName,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        provider: user.provider,
        avatar: user.avatar,
        role: user.role,
        username: user.username,
        mobile: user.mobile,
        country: user.country,
        occupation: user.occupation,
        region: user.region,
        cityOrVillage: user.cityOrVillage,
        createdAt: user.createdAt,
      }
    : null;

/**
 * Serialize author information for responses
 * @param {Object|string} user - User object or ID
 * @returns {Object|null} Serialized author object
 */
export const serializeAuthor = (user) => {
  if (!user) return null;

  if (typeof user === 'string') {
    return { id: user };
  }

  return {
    id: user.id || user._id,
    displayName: user.displayName || user.username || user.email,
  };
};
