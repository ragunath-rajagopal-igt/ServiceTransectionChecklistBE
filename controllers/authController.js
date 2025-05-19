const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/authModel");
const Blacklist = require("../models/blacklistModel");
const moduleRolePermissionController = require("./moduleRolePermissionController");
const moduleController = require("./moduleController");
const { constants } = require("../utils/constants");

const { createLogger } = require('../utils/loggerService');
const { generateRefreshToken, generateAccessToken } = require("../utils/tokenService");
const refreshTokenModel = require("../models/refreshTokenModel");
const { logAction } = require("./loggerController");
// Create a logger named 'AuthService'
const loggerService = createLogger('AuthService');
const { getSiteOptions } = require('../controllers/adminControl/siteController');

const MODULE_NAME = constants.LOGGER_MODULE.appUser;
// @desc Register a user
// @route POST /api/auth/register
// @access public
const registerUser = asyncHandler(async (req, res) => {
  const {
    username,
    email,
    password,
    role,
    organization,
    isAdmin,
    isEmailVerified,
    createdBy,
    updatedBy
  } = req.body;

  // Collect missing fields
  const missingFields = [];

  if (!username) missingFields.push("username");
  if (!email) missingFields.push("email");
  // if (!password) missingFields.push("password");
  if (!role) missingFields.push("role");
  if (!organization) missingFields.push("organization");

  // If there are missing fields, return an error
  if (missingFields.length > 0) {
    loggerService.warn("Registration failed: Missing fields", missingFields);
    return res.error(`Missing fields: ${missingFields.join(", ")}`, constants.VALIDATION_ERROR);
  }

  // Check if username is within the allowed length
  if (username.length < 3 || username.length > 50) {
    loggerService.warn("Registration failed: Username must be between 3 and 50 characters");
    return res.error("Username must be between 3 and 50 characters", constants.VALIDATION_ERROR);
  }

  // Check if the user already exists
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    loggerService.warn(`Registration failed: User already registered with email ${email}`);
    return res.error("User already registered!", constants.VALIDATION_ERROR);
  }

  // Validate email format
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    loggerService.warn("Registration failed: Invalid email format");
    return res.error("Please add a valid email address", constants.VALIDATION_ERROR);
  }

  // Enhanced password validation
  const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (password && !passwordCriteria.test(password)) {
    loggerService.warn("Registration failed: Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character");
    return res.error("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character", constants.VALIDATION_ERROR);
  }

  try {
    let hashedPassword = '';
    // Hash password
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Create the user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role, // Include role information
      organization, // Include organization information
      isAdmin: isAdmin || false, // Default value if not provided
      isEmailVerified: isEmailVerified || false,
      createdBy, // Set createdBy
      updatedBy  // Set updatedBy
    });

    // Log successful user creation
    loggerService.info(`User created successfully: ${user.email}`);

    if (user) {
      
			// Logger Data
			const loggerData = {
				recordId: user.id,
				currentData: user,
				updatedData: null,
				module: MODULE_NAME,
				action: constants.LOGGER_ACTION.create,
				createdBy: createdBy,
			}
			logAction(loggerData);

      return res.success({ _id: user.id, email: user.email }, "User data created successfully");
    } else {
      loggerService.error("User creation failed: User data is not valid");
      return res.error("User data is not valid!", constants.VALIDATION_ERROR);
    }
  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Error during user registration:", {
      message: error.message,
      stack: error.stack,
    });
    return res.error("Registration failed due to an unexpected error", constants.SERVER_ERROR);
  }
});


// @desc Update registered user 
// @route POST /api/auth/register
// @access public
const updateRegisteredAppUser = asyncHandler(async (req, res) => {
  try {
    const registeredId = req?.body?.id || null;

    if (!registeredId) {
      loggerService.warn("Update App User failed: Missing fields", missingFields);
      return res.error(`Missing fields: Id`, constants.VALIDATION_ERROR);
    }

    const {
      username,
      email,
      role,
      organization,
      status,
    } = req.body;
    
    const { id: updatedBy } = req.user;
  
    // Collect missing fields
    const missingFields = [];
  
    if (!username) missingFields.push("username");
    if (!email) missingFields.push("email");
    // if (!password) missingFields.push("password");
    if (!role) missingFields.push("role");
    if (!organization) missingFields.push("organization");
    if (!status) missingFields.push("status");

  
    // If there are missing fields, return an error
    if (missingFields.length > 0) {
      loggerService.warn("Registration failed: Missing fields", missingFields);
      return res.error(`Missing fields: ${missingFields.join(", ")}`, constants.VALIDATION_ERROR);
    }
  
    // Check if username is within the allowed length
    if (username.length < 3 || username.length > 50) {
      loggerService.warn("Registration failed: Username must be between 3 and 50 characters");
      return res.error("Name must be between 3 and 50 characters", constants.VALIDATION_ERROR);
    }
  
    // Check if the user already exists
    const userAvailable = await User.findOne({ email, $and: [ { _id: {
      $ne: registeredId
    }}] });
    if (userAvailable) {
      loggerService.warn(`Registration failed: User already registered with email ${email}`);
      return res.error("User already registered!", constants.VALIDATION_ERROR);
    }
  
    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      loggerService.warn("Registration failed: Invalid email format");
      return res.error("Please add a valid email address", constants.VALIDATION_ERROR);
    }

    if (registeredId) {
      const accountSettingAppUser = await User.findOne({ _id: registeredId });
      
      const data = {
        username,
        role,
        organization,
        status,
        updatedBy,
      }
      const updateAppUser = await User.findByIdAndUpdate(registeredId, data, {
        new: true
      });

      if (updateAppUser) {       
        const oldData = {
          username: accountSettingAppUser.username,
          role: accountSettingAppUser.role,
          organization: accountSettingAppUser.organization,
          status: accountSettingAppUser.status,
          updatedBy: accountSettingAppUser.updatedBy,
        }
        // Logger Data
        const loggerData = {
          recordId: updateAppUser.id,
          currentData: oldData,
          updatedData: data,
          module: MODULE_NAME,
          action: constants.LOGGER_ACTION.update,
          createdBy: updatedBy,
        }
        logAction(loggerData);
      }

      res.success({
				updateAppUser
			}, "App User updated successfully.");
    }

  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Error during user update:", {
      message: error.message,
      stack: error.stack,
    });
    return res.error("Update app user failed due to an unexpected error", constants.SERVER_ERROR);
  }
});

//@desc Login user
//@route POST /api/auth/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  try {
    loggerService.info('Login Request Body', req.body);

    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.error("Email & Password are mandatory!", constants.VALIDATION_ERROR);
    }

    // Find user by email
    const user = await User.findOne({ email, isArchive: false });

    if(user && user.status === constants.APPUSER_STATUS.inActive) {
      loggerService.warn("Login Attempt Failed: User inactivated", { email });
      return res.error("Account is Inactivated. Please contact to admin for details", constants.UNAUTHORIZED);
    }

    // Check if user exists, password matches, and user is not archived
    if (!user) {
      loggerService.warn("Login Attempt Failed: User not found or archived", { email });
      return res.error("Invalid Credentials", constants.UNAUTHORIZED);
    }


    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      loggerService.warn("Login Attempt Failed: Incorrect password", { email });
      return res.error("Invalid Credentials", constants.UNAUTHORIZED);
    }


    // Generate JWT access token
    const accessToken = await generateAccessToken(user);

    // Determine user permissions based on role
    const userPermission = await getUserPermission(user);

    const refreshToken = await generateRefreshToken(user._id);

    if(user.isAdmin === true){
      var siteallData = await getSiteOptions();
    }else{
      var userData = await getuserSiteOptions(user);
    }

    // Create user details object
    const userDetails = {
      name: user.username,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      organization: user.organization,
      sites: user.isAdmin? siteallData: userData,
      permission: userPermission,
    };

    loggerService.info('Login Request Success', userDetails);
    // Send success response
    res.success({ accessToken, refreshToken, userDetails }, "Login Successfully");

  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Login Request Failed", {
      message: error.message,
      stack: error.stack
    });
    res.error("An error occurred while processing the login request.", constants.SERVER_ERROR);
  }
});

//@desc get module permission for user
//@param user - object
const getUserPermission = asyncHandler(async (user) => {
  try {
    let userPermission = [];
    // if (user.isAdmin !== true) {
    //   const userPermissionData = await moduleRolePermissionController.userModulePermission(user.role);
    //   if (userPermissionData && userPermissionData.moduleCode) {
    //     userPermission = userPermissionData.moduleCode;
    //   }
    // } else if (user.isAdmin === true) {
     
    // }
     const userPermissionData = await moduleController.allModules();
      if (userPermissionData) {
        userPermission = userPermissionData;
      }
    return userPermission;
  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Error fetching user permissions", {
      message: error.message,
      stack: error.stack
    });
    return res.error("Failed to retrieve user permissions.", constants.SERVER_ERROR);
  }
});


//@desc Current user info
//@route POST /api/auth/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const refreshTokenHandler = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.error("Refresh Token is required", constants.VALIDATION_ERROR);
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const existingToken = await refreshTokenModel.findOne({ token: refreshToken, userId: decoded.userId });

    if (!existingToken) {
      return res.error("Invalid Refresh Token", constants.UNAUTHORIZED);
    }

    if (decoded && decoded.userId) {
      const accountSettingAppUser = await User.findOne({ _id: decoded.userId });
      if (accountSettingAppUser && accountSettingAppUser.status === constants.APPUSER_STATUS.inActive) {
        return res.error("User is not authorized. Account made Inactivated", constants.UNAUTHORIZED);
      }
    }

    // Check if the refresh token is expired
    if (existingToken.expiresAt < new Date()) {
      await existingToken.delete(); // Remove expired token from the database
      return res.error("Refresh Token Expired", constants.UNAUTHORIZED);
    }

    // Generate a new access token
    const user = await User.findOne({ _id: decoded.userId });
    const accessToken = await generateAccessToken(user);

    res.success({ accessToken }, "Access Token Refreshed Successfully");

  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.error("Refresh Token Expired", constants.UNAUTHORIZED);
    }
    // Log the error and send a generic server error response
    loggerService.error("Generate Refresh Token Failed", {
      message: error.message,
      stack: error.stack
    });
    res.error("An error occurred while refreshing access token", constants.SERVER_ERROR);
  }
});


/**
 * @route POST /auth/logout
 * @desc Logout user
 * @access Public
 */
const logoutUser = asyncHandler(async (req, res) => {
  try {
    // Retrieve the Authorization header
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
      const accessToken = authHeader.split(" ")[1];

      // Check if the token is already blacklisted
      const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
      if (checkIfBlacklisted) {
        // Log and send a no-content response if already blacklisted
        loggerService.warn("Attempted to logout with an already blacklisted token", { token: accessToken });
        return res.error("Invalid token. Please try login!", constants.UNAUTHORIZED);
      }

      // Add the access token to the blacklist
      const newBlacklist = new Blacklist({ token: accessToken });
      await newBlacklist.save();

      // Handle the refresh token from the request body, if it exists
      const { refreshToken } = req.body;
      if (refreshToken) {
        // Remove the refresh token from the database
        await refreshTokenModel.findOneAndDelete({ token: refreshToken });
      }

      // Log successful token blacklisting
      loggerService.info("Access token successfully blacklisted and refresh token cleared", {
        accessToken,
        refreshToken,
      });

      // Clear client cookies
      res.clearCookie('refreshToken', { httpOnly: true, secure: true, sameSite: 'Strict' });

      // Send a successful logout response
      res.success({}, "You are logged out!");
    } else {
      // If no Authorization header is found, log and send a no-content response
      loggerService.warn("Logout request missing Authorization header");
      return res.error("Authorization header is missing", constants.UNAUTHORIZED);
    }
  } catch (error) {
    // Log the error and send a server error response
    loggerService.error("Logout Failed", {
      message: error.message,
      stack: error.stack,
    });
    res.error("Internal Server Error", constants.SERVER_ERROR);
  }
});

//Verify Account
const verifyAccount = asyncHandler(async (req, res) => {

  const { email,forgotPassword } = req.body;

  try {

    // Find user by email
    const user = await User.findOne({ email, isArchive: false });

    // Check if user exists or not
    if (!user) {
      loggerService.warn("Account verification failed : Account not found", { email });
      return res.error("Invalid Email address", constants.VALIDATION_ERROR);
    } else if (user && user.isEmailVerified === true && forgotPassword === false) {
      loggerService.warn("Account verification failed : Account not found", { email });
      return res.error("Email is already verified", constants.VALIDATION_ERROR);
    } else {
      const response = {
        id: user.id,
        email: user.email,
        userName: user.username,
      }
      return res.success({ response }, "Email address validated successfully", constants.SUCCESS);
    }

  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Verify Email Request Failed", {
      message: error.message,
      stack: error.stack
    });
    res.error("An error occurred while processing the verify email request.", constants.SERVER_ERROR);
  }

});

//Update Password
const updatePassword = asyncHandler(async (req, res) => {
  const { id, password } = req.body;

  try {
    // Enhanced password validation
    const passwordCriteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordCriteria.test(password)) {
      loggerService.warn("Update failed: Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character");
      return res.error("Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character @$!%*?&", constants.VALIDATION_ERROR);
    }
    // generate Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //find and update by id
    const updatedUserInfo = await User.findByIdAndUpdate(id, {
      password: hashedPassword,
      isEmailVerified: true,
    },
      { new: true } // return the updated document

    );

    // Log the update
    loggerService.info(`Password updated with ID: ${id}`, { updatedUserInfo });
    res.success({ updatedUserInfo }, "Password updated successfully.");

  } catch (error) {
    // Log the error and send a generic server error response
    loggerService.error("Update Password Request Failed", {
      message: error.message,
      stack: error.stack
    });
    res.error("An error occurred while processing the update password request.", constants.SERVER_ERROR);
  }

})

function getuserSiteOptions(users){
console.log("users",users);
const sites = users.sites.map((data)=>{
  return {
    label: data,
    value:data
  }
})
return sites;
}


module.exports = { registerUser, loginUser, currentUser, logoutUser, refreshTokenHandler, verifyAccount, updatePassword, updateRegisteredAppUser };