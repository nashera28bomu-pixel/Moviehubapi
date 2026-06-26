import { config } from '../config/index.js';
import { HTTP_STATUS } from '../config/constants.js';

const errorHandler = (err, _req, res, _next) => {
  const status = err.status || err.statusCode || HTTP_STATUS.INTERNAL_ERROR;
  const error = err.name || 'InternalServerError';
  const message = err.message || 'An unexpected error occurred';

  if (!config.server.isProduction) {
    console.error(`[ErrorHandler] ${status} ${error}: ${message}`);
    if (err.stack) console.error(err.stack);
  }

  res.status(status).json({
    success: false,
    status,
    error,
    message,
    ...((!config.server.isProduction && err.stack) && { stack: err.stack }),
  });
};

export default errorHandler;
