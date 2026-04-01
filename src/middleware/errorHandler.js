const logger = require("../config/logger");

const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal server error";

  if (statusCode >= 500) {
    logger.error(message, { stack: error.stack });
  }

  res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
