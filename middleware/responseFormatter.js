const { constants } = require("../utils/constants");

const {
    SUCCESS,
    VALIDATION_ERROR,
} = constants;

//success message format
const responseFormatter = (req, res, next) => {
  res.success = (data, message = '', metadata = {}, links = {}) => {
    res.status(SUCCESS).json({
      status: 'success',
      message,
      data,
      metadata,
      links
    });
  };

//error message format
  res.error = (message, code = VALIDATION_ERROR, details = {}) => {
    res.status(code).json({
      status: 'error',
      message: message,
      error: {
        code,
        message,
        details
      },
      metadata: {
        timestamp: new Date().toISOString(),
      }
    });
  };

  next();
};

module.exports = responseFormatter;