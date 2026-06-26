import { LRUCache } from 'lru-cache';
import { config } from './index.js';
import { CACHE_MAX_ITEMS } from './constants.js';

const store = new LRUCache({
  max: config.cache.maxItems || CACHE_MAX_ITEMS,
  ttl: config.cache.defaultTtl * 1000,
  ttlAutopurge: true,
  allowStale: false,
});

let hits = 0;
let misses = 0;

/**
 * Build a cache key from a prefix + params object.
 */
export const buildKey = (prefix, params = {}) => {
  const sorted = Object.keys(params)
    .sort()
    .reduce((acc, k) => {
      acc[k] = params[k];
      return acc;
    }, {});
  return `${prefix}:${JSON.stringify(sorted)}`;
};

/**
 * Retrieve a value from cache.
 */
export const get = (key) => {
  const value = store.get(key);
  if (value !== undefined) {
    hits++;
    return value;
  }
  misses++;
  return null;
};

/**
 * Store a value in cache with optional TTL (seconds).
 */
export const set = (key, value, ttlSeconds = null) => {
  const options = ttlSeconds ? { ttl: ttlSeconds * 1000 } : {};
  store.set(key, value, options);
};

/**
 * Delete a value from cache.
 */
export const del = (key) => {
  store.delete(key);
};

/**
 * Clear entire cache.
 */
export const clear = () => {
  store.clear();
  hits = 0;
  misses = 0;
};

/**
 * remember(key, ttl, fn) — return cached value or compute + cache it.
 */
export const remember = async (key, ttlSeconds, fn) => {
  if (!config.cache.enabled) {
    return fn();
  }

  const cached = get(key);
  if (cached !== null) {
    return cached;
  }

  const result = await fn();
  set(key, result, ttlSeconds);
  return result;
};

/**
 * Cache statistics.
 */
export const stats = () => ({
  size: store.size,
  max: store.max,
  hits,
  misses,
  hitRate: hits + misses > 0 ? ((hits / (hits + misses)) * 100).toFixed(2) + '%' : '0%',
});

const cache = { get, set, del, clear, remember, stats, buildKey };
export default cache;
