import 'dotenv/config';

const required = (key) => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

const optional = (key, fallback) => process.env[key] ?? fallback;

export const config = {
  server: {
    port: parseInt(optional('PORT', '5000'), 10),
    nodeEnv: optional('NODE_ENV', 'development'),
    isProduction: optional('NODE_ENV', 'development') === 'production',
  },

  cors: {
    origin: optional('CORS_ORIGIN', '*'),
    methods: ['GET', 'POST', 'OPTIONS'],
  },

  moviebox: {
    baseUrl: optional('MOVIEBOX_BASE_URL', 'https://h5-api.aoneroom.com'),
    apiVersion: optional('MOVIEBOX_API_VERSION', 'v2'),
    appKey: optional('MOVIEBOX_APP_KEY', 'moviebox_app'),
    timeout: parseInt(optional('MOVIEBOX_TIMEOUT', '15000'), 10),
  },

  cache: {
    enabled: optional('CACHE_ENABLED', 'true') === 'true',
    maxItems: parseInt(optional('CACHE_MAX_ITEMS', '500'), 10),
    defaultTtl: parseInt(optional('CACHE_DEFAULT_TTL', '600'), 10),
  },

  redis: {
    url: optional('REDIS_URL', null),
    enabled: !!optional('REDIS_URL', null),
  },

  rateLimit: {
    windowMs: parseInt(optional('RATE_LIMIT_WINDOW_MS', '60000'), 10),
    max: parseInt(optional('RATE_LIMIT_MAX', '100'), 10),
  },

  log: {
    level: optional('LOG_LEVEL', 'combined'),
  },
};
