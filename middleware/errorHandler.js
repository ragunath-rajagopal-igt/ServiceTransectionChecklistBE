const { constants } = require("../utils/constants");

// Error handler
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case constants.VALIDATION_ERROR:
    case constants.NOT_FOUND:
    case constants.UNAUTHORIZED:
    case constants.FORBIDDEN:
    case constants.FORBIDDEN:
    case constants.SERVER_ERROR:
      res.status(statusCode).json({
        status: 'error',
        message: err.message,
        error: {
          statusCode,
          message: err.message,
          details: {}
        },
        metadata: {
          timestamp: new Date().toISOString(),
        }
      });
      break;
    default:
      break;
  }
};

module.exports = errorHandler;