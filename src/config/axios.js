import axios from 'axios';
import axiosRetry from 'axios-retry';
import { config } from './index.js';
import { RETRY_CONFIG, REQUEST_TIMEOUT } from './constants.js';
import { buildRequestHeaders, signParams } from '../utils/crypto.js';
import { mapAxiosError } from '../utils/request.js';

const client = axios.create({
  baseURL: config.moviebox.baseUrl,
  timeout: config.moviebox.timeout || REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Automatic retries
axiosRetry(client, {
  retries: RETRY_CONFIG.retries,
  retryDelay: (retryCount) =>
    Math.min(RETRY_CONFIG.retryDelay * Math.pow(2, retryCount - 1), 10000),
  retryCondition: RETRY_CONFIG.retryCondition,
  onRetry: (retryCount, error) => {
    const url = error.config?.url || 'unknown';
    console.warn(`[Axios Retry] Attempt ${retryCount} for ${url} — ${error.message}`);
  },
});

// Request interceptor: inject headers and sign params
client.interceptors.request.use(
  (reqConfig) => {
    const baseHeaders = buildRequestHeaders();
    reqConfig.headers = {
      ...reqConfig.headers,
      ...baseHeaders,
    };

    // Sign query params
    if (reqConfig.params) {
      reqConfig.params = signParams(reqConfig.params);
    }

    if (!config.server.isProduction) {
      const params = new URLSearchParams(reqConfig.params || {}).toString();
      console.debug(`[Axios] → ${reqConfig.method?.toUpperCase()} ${reqConfig.url}${params ? '?' + params : ''}`);
    }

    return reqConfig;
  },
  (error) => Promise.reject(error),
);

// Response interceptor: log + map errors
client.interceptors.response.use(
  (response) => {
    if (!config.server.isProduction) {
      console.debug(`[Axios] ← ${response.status} ${response.config?.url}`);
    }
    return response;
  },
  (error) => Promise.reject(mapAxiosError(error)),
);

export default client;
