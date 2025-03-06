const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const Blacklist = require("../models/blacklistModel");
const { constants } = require("../utils/constants");
const User = require("../models/authModel");

//validate token
const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.Authorization || req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];

    const checkIfBlacklisted = await Blacklist.findOne({ token: token }); // Check if that token is blacklisted
    // // if true, send an unathorized message, asking for a re-authentication.
    if (checkIfBlacklisted)
        return res.error("This session has expired. Please login", constants.UNAUTHORIZED);
    // if token has not been blacklisted, verify with jwt to see if it has been

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.error("User is not authorized", constants.UNAUTHORIZED);
      }
      req.user = decoded.user;

      if (req.user && req.user.email) {
          const accountSettingAppUser = await User.findOne({ email: req.user.email });
          if (accountSettingAppUser && accountSettingAppUser.status === constants.APPUSER_STATUS.inActive) {
            return res.error("User is not authorized. Account made Inactivated", constants.UNAUTHORIZED);
          }
      }
      next();
    });

    if (!token) {
      res.error("User is not authorized or token is missing", constants.UNAUTHORIZED);
    }
  } else {
    return res.error("User is not authorized or token is missing", constants.UNAUTHORIZED);
  }
});

module.exports = validateToken;