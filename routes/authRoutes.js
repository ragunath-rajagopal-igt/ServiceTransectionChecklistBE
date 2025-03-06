const express = require("express");
const {
  currentUser,
  loginUser,
  registerUser,
  logoutUser,
  refreshTokenHandler,
  verifyAccount,
  updatePassword
} = require("../controllers/authController");
const vaidateOrganizationHandler = require('../middleware/vaidateOrganizationHandler');

const validateToken = require("../middleware/validateTokenHandler");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/user", validateToken, vaidateOrganizationHandler, currentUser);

router.post("/logout", validateToken, logoutUser);

router.post("/refresh-token", refreshTokenHandler);

router.post("/verify-email",verifyAccount);

router.post("/update-password",updatePassword);

module.exports = router;