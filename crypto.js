import crypto from 'crypto';
import { APP_VERSION, PACKAGE_NAME, PLATFORM } from '../config/constants.js';

/**
 * Generate a Unix timestamp in seconds.
 */
export const getTimestamp = () => Math.floor(Date.now() / 1000).toString();

/**
 * Generate a random UUID-style device/request ID.
 */
export const generateRequestId = () => crypto.randomUUID().replace(/-/g, '');

/**
 * Generate a random 16-hex device ID if none is persisted.
 */
export const generateDeviceId = () => crypto.randomBytes(8).toString('hex');

/**
 * MD5 hash of a string.
 */
export const md5 = (str) => crypto.createHash('md5').update(str).digest('hex');

/**
 * SHA256 HMAC of a string with a given secret.
 */
export const hmacSha256 = (data, secret) =>
  crypto.createHmac('sha256', secret).update(data).digest('hex');

/**
 * SHA1 hash of a string.
 */
export const sha1 = (str) => crypto.createHash('sha1').update(str).digest('hex');

/**
 * Build the canonical query string for signing — sorted keys, url-encoded values.
 */
export const buildCanonicalQuery = (params) => {
  return Object.keys(params)
    .sort()
    .filter((k) => params[k] !== undefined && params[k] !== null && params[k] !== '')
    .map((k) => `${k}=${encodeURIComponent(String(params[k]))}`)
    .join('&');
};

/**
 * MovieBox v2 API signature generator.
 *
 * Reverse-engineered from the Python moviebox-api library (h5-api.aoneroom.com).
 * The signing algorithm:
 *   1. Build sorted canonical param string
 *   2. Append secret salt
 *   3. MD5 the result → sign
 *
 * The salt / app-key is embedded in the Android APK / JS bundle.
 * Using the publicly observable value from the Python library.
 */
const SIGN_SALT = 'jmYRrGvhujLwKNnL';

export const generateSignature = (params) => {
  const canonical = buildCanonicalQuery(params);
  return md5(`${canonical}${SIGN_SALT}`);
};

/**
 * Build the standard headers required by the MovieBox API.
 */
export const buildRequestHeaders = (extraHeaders = {}) => {
  const timestamp = getTimestamp();
  const requestId = generateRequestId();

  return {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'User-Agent': `Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36`,
    'X-App-Version': APP_VERSION,
    'X-Platform': PLATFORM,
    'X-Package-Name': PACKAGE_NAME,
    'X-Request-Id': requestId,
    'X-Timestamp': timestamp,
    Referer: 'https://h5.aoneroom.com/',
    Origin: 'https://h5.aoneroom.com',
    ...extraHeaders,
  };
};

/**
 * Sign a params object and return merged params with `sign` field.
 */
export const signParams = (params) => {
  const timestamp = getTimestamp();
  const mergedParams = {
    ...params,
    timestamp,
  };
  const sign = generateSignature(mergedParams);
  return { ...mergedParams, sign };
};
