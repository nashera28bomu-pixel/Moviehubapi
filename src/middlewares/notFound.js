import { HTTP_STATUS } from '../config/constants.js';

const notFound = (req, res) => {
  res.status(HTTP_STATUS.NOT_FOUND).json({
    success: false,
    status: HTTP_STATUS.NOT_FOUND,
    error: 'NotFound',
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

export default notFound;
