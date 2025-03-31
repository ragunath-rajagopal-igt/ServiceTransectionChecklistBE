
const asyncHandler = require("express-async-handler");
const { createFormFieldFromJSON } = require('../../utils/formFieldHandler');
const { constant } = require("../../utils/constant");
const { createLogger } = require('../../utils/loggerService')
const subAreaFeilds = require('../../formFields/adminFeilds/subAreaFeilds.json');
const subareaModel = require("../../models/admin/subareaModel");
const loggerService = createLogger('Impact');

// get list data
const getSubarea = asyncHandler(async (req, res) => {
  const users = await subareaModel.find().sort({ subarea: 1 });
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
      user = await subareaModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await subareaModel.findOne().sort({ createdAt: -1 });
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
    res.error("creation failed", constant.SERVER_ERROR);
  }
});


// //@desc Add and Edit User
const generateUserFormBuild = asyncHandler(async(user) => {
    console.log('user', user);
  const dynamicOptions = {
    active: constant.adminAction,
  }
  const disabledFields = [];
  const cloneField = structuredClone(subAreaFeilds);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});

//@desc save User
const saveSubarea = asyncHandler(async (req, res) => {
    const loadData = {
        label:req.body.subarea,
        subarea:req.body.subarea,
        active:req.body.active
    }
    const user = await subareaModel.create(loadData);    
    if (user) {
      res.status(201).json({ message: "Created Successfully"});
    } else {
      res.status(400).json(req.body);
      res.error("creation failed", constants.VALIDATION_ERROR);
    }
});

// //@desc Update User
// //@route PUT /api/auth/updateuser
// //@access private
const updateSubarea = asyncHandler(async (req, res) => {
    const loadData = {
        label:req.body.subarea,
        subarea:req.body.subarea,
        active:req.body.active
    }
  const id = req.body._id; 
  const updatedUser = await subareaModel.findByIdAndUpdate(id, loadData, { new: true });
  if (updatedUser) {
    res.status(201).json({message:'Update Successfully'});
  } else {
    res.status(400).json(req.body);
    throw new Error("All fields are mandatory!");
  }
});


// // @desc Delete user by ID
// // @route DELETE /api/user/delete/:id
// // @access Private
const deleteSubarea = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;  // Extract the ID from the request parameters
      const deletedUser = await subareaModel.deleteOne({ _id: id });  // Delete the document with the specified ID
  
      if (deletedUser.deletedCount === 0) {
        return res.error("No sub area found with the given ID.");
      }
      res.success("Deleted successfully.");  // Respond with success
    } catch (error) {
      console.error(error);  // Log the error for debugging
      return res.error("An error occurred while deleting the sub area.");
    }
  });
  


module.exports = { generateForm , saveSubarea , getSubarea, updateSubarea, deleteSubarea};
