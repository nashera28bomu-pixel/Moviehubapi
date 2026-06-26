import { HTTP_STATUS } from '../config/constants.js';

/**
 * Extract the data payload from a MovieBox API response.
 * The upstream API wraps data in { code, message, data } or { code, msg, data }.
 */
export const unwrapResponse = (response) => {
  const body = response?.data;

  if (!body) {
    throw createApiError('Empty response from MovieBox API', HTTP_STATUS.BAD_GATEWAY);
  }

  const code = body.code ?? body.status;

  if (code !== undefined && code !== 0 && code !== 200 && code !== '0' && code !== '200') {
    const msg = body.message || body.msg || 'Upstream API returned an error';
    throw createApiError(msg, HTTP_STATUS.BAD_GATEWAY, code);
  }

  return body.data ?? body;
};

/**
 * Create a structured API error.
 */
export const createApiError = (message, status = 500, upstreamCode = null) => {
  const err = new Error(message);
  err.status = status;
  err.isApiError = true;
  if (upstreamCode !== null) err.upstreamCode = upstreamCode;
  return err;
};

/**
 * Map an Axios error to a structured application error.
 */
export const mapAxiosError = (axiosError) => {
  if (axiosError.response) {
    const status = axiosError.response.status;
    const body = axiosError.response.data;
    const message = body?.message || body?.msg || axiosError.message || 'Upstream request failed';
    return createApiError(message, status >= 500 ? HTTP_STATUS.BAD_GATEWAY : status);
  }

  if (axiosError.code === 'ECONNABORTED' || axiosError.code === 'ETIMEDOUT') {
    return createApiError('Upstream request timed out', HTTP_STATUS.SERVICE_UNAVAILABLE);
  }

  if (axiosError.request) {
    return createApiError('No response from upstream service', HTTP_STATUS.BAD_GATEWAY);
  }

  return createApiError(axiosError.message || 'Request configuration error', HTTP_STATUS.INTERNAL_ERROR);
};
