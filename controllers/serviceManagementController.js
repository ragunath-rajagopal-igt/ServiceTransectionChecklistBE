const asyncHandler = require("express-async-handler");
const ServiceManagementModel = require("../models/serviceManagementModel");
const { constant } = require("../utils/constant");
const { createLogger } = require('../utils/loggerService')
const { createFormFieldFromJSON } = require('../utils/formFieldHandler');
const loggerService = createLogger('Impact');
const serviceManagementFormFields = require('../formFields/serviceManagementFields.json');


//@desc Edit User
//@route POST /api/user/edit
//@access private
const generateForm = asyncHandler(async (req, res) => {
  try {
    let user = {};
    const existingFormValue = req?.body || {};
    if (req.body && req.body.id && !existingFormValue._id) {
      user = await ServiceManagementModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await ServiceManagementModel.findOne().sort({ createdAt: -1 });
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
  const dynamicOptions = {
    severity: constant.severityOption,
    subArea: constant.subAreaOption,
    itemActivity: constant.itemActivityOption,
    productName: constant.productNameOption,
    owner: constant.ownerNameOption,
    status: constant.statusOption,
  }
  const disabledFields = [];
  const cloneField = structuredClone(serviceManagementFormFields);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});


//@desc save Users
//@route POST /api/save
//@access private
const saveServiceManagement = asyncHandler(async (req, res) => {
    const data = req.body;   
    const user = await ServiceManagementModel.create(data);    
    if (user) {
      res.status(201).json({ message: "Created Successfully"});
    } else {
      res.status(400).json(req.body);
      res.error("creation failed", constants.VALIDATION_ERROR);
    }
});


//@desc Get Users
//@route GET /api/user/list
//@access private
const getServiceManagement = asyncHandler(async (req, res) => {
  const users = await ServiceManagementModel.find().sort({ createdAt: -1 }).limit(10);
  if (users) {
    res.status(201).json(users);
  }
});

//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const updateServiceManagement = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = req.body._id; 
  const updatedUser = await ServiceManagementModel.findByIdAndUpdate(id, data, { new: true });
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
const deleteServiceManagement = asyncHandler(async (req, res) => {
  try {
      const id  = req.params.id; 
      const deletedUser = await ServiceManagementModel.deleteOne({_id:id});     
      const loggerData = {
        updatedData: deletedUser,
      }
      loggerService.info(`deleted with ID: ${id}`);
      res.success( "deleted successfully.");
  } catch (error) {
      return res.error("An error occurred while creating Incident.", constants.SERVER_ERROR);
  }
});


module.exports = { getServiceManagement, saveServiceManagement, deleteServiceManagement, updateServiceManagement, generateForm};
