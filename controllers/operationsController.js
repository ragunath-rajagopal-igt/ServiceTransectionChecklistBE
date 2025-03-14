const asyncHandler = require("express-async-handler");
const OperationsModel = require("../models/operationsModel");
const { constant } = require("../utils/constant");
const { createLogger } = require('../utils/loggerService')
const { createFormFieldFromJSON } = require('../utils/formFieldHandler');
const loggerService = createLogger('Impact');
const operationsFormFields = require('../formFields/operationsFields.json');
const severityModel = require("../models/admin/severityModel");
const subareaModel = require("../models/admin/subareaModel");

//@desc Edit User
//@route POST /api/user/edit
//@access private
const generateForm = asyncHandler(async (req, res) => {
  try {
    let user = {};
    const existingFormValue = req?.body || {};
    if (req.body && req.body.id && !existingFormValue._id) {
      user = await OperationsModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await OperationsModel.findOne().sort({ createdAt: -1 });
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
  const severityOpt = await severityModel.aggregate([
    { 
      $project: {
        label: 1, 
        value: "$severity",
        active:1
      }
    }, 
    {
      $match: { active: 'active' }
    },
    { 
      $sort: { createdAt: -1 } // Sort by 'createdAt' if necessary
    }
  ]);
    const subareaOpt = await subareaModel.aggregate([
      { 
        $project: {
          label: 1, 
          value: "$subarea",
          active:1
        }
      }, 
      {
        $match: { active: 'active' }
      },
      { 
        $sort: { createdAt: -1 } // Sort by 'createdAt' if necessary
      }
    ]);
  const dynamicOptions = {
    severity: severityOpt,
    subArea: subareaOpt,
    itemActivity: constant.itemActivityOption,
    productName: constant.productNameOption,
    owner: constant.ownerNameOption,
    status: constant.statusOption,
  }
  const disabledFields = [];
  const cloneField = structuredClone(operationsFormFields);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});


//@desc save Users
//@route POST /api/save
//@access private
const saveOperations = asyncHandler(async (req, res) => {
    const data = req.body;   
    const user = await OperationsModel.create(data);    
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
const getOperations = asyncHandler(async (req, res) => {
  const users = await OperationsModel.find().sort({ createdAt: -1 }).limit(10);
  if (users) {
    res.status(201).json(users);
  }
});

//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const updateOperations = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = req.body._id; 
  const updatedUser = await OperationsModel.findByIdAndUpdate(id, data, { new: true });
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
const deleteOperations = asyncHandler(async (req, res) => {
  try {
      const id  = req.params.id; 
      const deletedUser = await OperationsModel.deleteOne({_id:id});     
      const loggerData = {
        updatedData: deletedUser,
      }
      loggerService.info(`deleted with ID: ${id}`);
      res.success( "deleted successfully.");
  } catch (error) {
      return res.error("An error occurred while creating Incident.", constants.SERVER_ERROR);
  }
});


module.exports = { getOperations, updateOperations, deleteOperations, saveOperations, generateForm};
