
const asyncHandler = require("express-async-handler");
const { createFormFieldFromJSON } = require('../utils/formFieldHandler');
const { constant } = require("../utils/constant");
const { createLogger } = require('../utils/loggerService')
const userFields = require('../formFields/userFields.json');
const userModel = require("../models/userModel");
const loggerService = createLogger('Impact');
const { getSiteOptions } = require('../controllers/adminControl/siteController');

// get list data
const getUsers = asyncHandler(async (req, res) => {
  const users = await userModel.find().sort({ status: 1 });
  if (users) {
    res.status(201).json(users);
  }
});

//@desc Edit User
//@route POST /api/user/edit
//@access private
const generateForm = asyncHandler(async (req, res) => {
  try {
    let user = {};
    const existingFormValue = req?.body || {};
    if (req.body && req.body.id && !existingFormValue._id) {
      user = await userModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await userModel.findOne().sort({ createdAt: -1 });
      if (terminatedUser && terminatedUser.isTerminated === true) {
        user = terminatedUser;
      } else {
        user = existingFormValue;
      }
    }
    let setResponse = await generateUserFormBuild(user);   
   
    res.json({renderData:setResponse});

  } catch(error) {
    res.status(400).json(req.body);
    res.error("creation failed", constants.VALIDATION_ERROR);
  }
});


//@desc Add and Edit User
const generateUserFormBuild = asyncHandler(async(user) => {
    const siteOpt = await getSiteOptions();
  const dynamicOptions = {
    active: constant.adminAction,
    sites: siteOpt
  }
  const disabledFields = [];
  const cloneField = structuredClone(userFields);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});

//@desc save User
const saveUser = asyncHandler(async (req, res) => {
    const loadData = {
      username:req.body.username,
      email:req.body.email,
      password:req.body.password,
      sites:req.body.sites
    }
    const user = await userModel.create(loadData);    
    if (user) {
      res.status(201).json({ message: "Created Successfully"});
    } else {
      res.status(400).json(req.body);
      res.error("creation failed", constants.VALIDATION_ERROR);
    }
});

//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const loadData = {
    username:req.body.username,
    email:req.body.email,
    password:req.body.password,
    sites:req.body.sites
  }
  const id = req.body._id; 
  const updatedUser = await userModel.findByIdAndUpdate(id, loadData, { new: true });
  if (updatedUser) {
    res.status(201).json({message:'Update Successfully'});
  } else {
    res.status(400).json(req.body);
    throw new Error("All fields are mandatory!");
  }
});


// @desc Delete user by ID
// @route DELETE /api/user/delete/:id
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;  // Extract the ID from the request parameters
      const deletedUser = await userModel.deleteOne({ _id: id });  // Delete the document with the specified ID
  
      if (deletedUser.deletedCount === 0) {
        return res.error("No severity found with the given ID.");
      }
      res.success("Deleted successfully.");  // Respond with success
    } catch (error) {
      console.error(error);  // Log the error for debugging
      return res.error("An error occurred while deleting the severity.");
    }
  });
  


module.exports = { generateForm, saveUser , getUsers, updateUser , deleteUser};
