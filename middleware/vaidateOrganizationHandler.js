// middleware/organizationMiddleware.js
const asyncHandler = require('express-async-handler');
const { constants } = require('../utils/constants');

//validate organization code
const vaidateOrganizationHandler = asyncHandler(async (req, res, next) => {
  const organizationCode = req.header('organizationCode');

  if (!organizationCode) {
    return res.error('Organization code is required', constants.VALIDATION_ERROR);
  }

  // Attach the organization code to the request for further use
  req.organizationCode = organizationCode;

  // Proceed to the next middleware or route handler
  next();
});

module.exports = vaidateOrganizationHandler;
