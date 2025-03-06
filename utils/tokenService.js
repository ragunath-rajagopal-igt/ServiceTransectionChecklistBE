const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/refreshTokenModel"); // Adjust path as needed

// Generate Access Token
const generateAccessToken = (user) => {
  return jwt.sign(
    {
      user: {
        username: user.username,
        email: user.email,
        id: user._id, // Ensure you reference the `_id` field correctly
        role: user.role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.TOKEN_EXPIRY_IN_TIME }
  )
};

// Generate Refresh Token
const generateRefreshToken = async (userId) => {
  const refreshToken = jwt.sign(
    {
      userId
    },
    process.env.REFRESH_TOKEN_SECRET, // Make sure to add this in your environment variables
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY_IN_TIME } // Expires in 7 days
  );

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // Set expiration date to 7 days later

  // Save refresh token in the database
  await RefreshToken.create({ token: refreshToken, userId, expiresAt });

  return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
