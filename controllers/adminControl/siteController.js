
const asyncHandler = require("express-async-handler");
const { createFormFieldFromJSON } = require('../../utils/formFieldHandler');
const { constant } = require("../../utils/constant");
const { createLogger } = require('../../utils/loggerService')
const siteFields = require('../../formFields/adminFeilds/siteFields.json');
const SiteModel = require("../../models/admin/siteModel");
const loggerService = createLogger('Impact');

// get list data
const getSite = asyncHandler(async (req, res) => {
  const users = await SiteModel.find().sort({ status: 1 });
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
      user = await SiteModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await SiteModel.findOne().sort({ createdAt: -1 });
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
    console.log('user', user);
  const dynamicOptions = {
    active: constant.adminAction,
  }
  const disabledFields = [];
  const cloneField = structuredClone(siteFields);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});

//@desc save User
const saveSite = asyncHandler(async (req, res) => {
    const loadData = {
        label:req.body.site,
        site:req.body.site,
        active:req.body.active
    }
    const user = await SiteModel.create(loadData);    
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
const updateSite = asyncHandler(async (req, res) => {
    const loadData = {
        label:req.body.site,
        site:req.body.site,
        active:req.body.active
    }
  const id = req.body._id; 
  const updatedUser = await SiteModel.findByIdAndUpdate(id, loadData, { new: true });
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
const deleteSite = asyncHandler(async (req, res) => {
    try {
      const id = req.params.id;  // Extract the ID from the request parameters
      const deletedUser = await SiteModel.deleteOne({ _id: id });  // Delete the document with the specified ID
  
      if (deletedUser.deletedCount === 0) {
        return res.error("No severity found with the given ID.");
      }
      res.success("Deleted successfully.");  // Respond with success
    } catch (error) {
      console.error(error);  // Log the error for debugging
      return res.error("An error occurred while deleting the severity.");
    }
  });
  

const getSiteOptions = asyncHandler(async(format)=>{
  const siteDetails = await SiteModel.find()
  .exec();

  return siteDetails.map(category=>({
    value:category.site,
    label:category.site
  }))
})


module.exports = { generateForm, saveSite , getSite, updateSite , deleteSite,getSiteOptions};
