/**
 * Return a shallow copy of an object with only allowed keys.
 */
export const pick = (obj, keys) =>
  keys.reduce((acc, key) => {
    if (key in obj) acc[key] = obj[key];
    return acc;
  }, {});

/**
 * Parse an integer query param with a fallback.
 */
export const parseIntParam = (value, fallback = 1) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

/**
 * Parse a string that should be a positive integer; throw if invalid.
 */
export const requirePositiveInt = (value, name) => {
  const parsed = parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    throw new Error(`${name} must be a positive integer`);
  }
  return parsed;
};

/**
 * Clamp a number between min and max.
 */
export const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

/**
 * Safely serialize an error to a plain object.
 */
export const serializeError = (err) => ({
  name: err.name || 'Error',
  message: err.message || 'An unexpected error occurred',
  ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
});

/**
 * Build a standardised success response object.
 */
export const successResponse = (data, meta = {}) => ({
  success: true,
  data,
  ...(Object.keys(meta).length > 0 && { meta }),
});

/**
 * Build a standardised error response object.
 */
export const errorResponse = (status, error, message) => ({
  success: false,
  status,
  error,
  message,
});

/**
 * Sleep for ms milliseconds (useful in retry/backoff).
 */
export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Check if a value is a non-empty string.
 */
export const isNonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0;

/**
 * Normalise page / limit params for pagination.
 */
export const parsePagination = (query) => ({
  page: clamp(parseIntParam(query.page, 1), 1, 9999),
  limit: clamp(parseIntParam(query.limit, 20), 1, 100),
});
