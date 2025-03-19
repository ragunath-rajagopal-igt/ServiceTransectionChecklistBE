const asyncHandler = require("express-async-handler");
const TechnicalModel = require("../models/technicalModel");
const { constant } = require("../utils/constant");
const { createLogger } = require('../utils/loggerService')
const { createFormFieldFromJSON } = require('../utils/formFieldHandler');
const loggerService = createLogger('Impact');
const technicalFormFields = require('../formFields/technicalFields.json');
const severityModel = require("../models/admin/severityModel");
const subareaModel = require("../models/admin/subareaModel");
const itemModel = require("../models/admin/itemModel");
const productNameModel = require("../models/admin/productnameModel");
const ownerModel = require("../models/admin/ownerModel");
const statusModel = require("../models/admin/statusModel");

//@desc Edit User
//@route POST /api/user/edit
//@access private
const generateForm = asyncHandler(async (req, res) => {
  try {
    let user = {};
    const existingFormValue = req?.body || {};
    if (req.body && req.body.id && !existingFormValue._id) {
      user = await TechnicalModel.findOne({ _id: req.body.id });
    } else {
      const terminatedUser = await TechnicalModel.findOne().sort({ createdAt: -1 });
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
        const itemOpt = await itemModel.aggregate([
                      { 
                        $project: {
                          label: 1, 
                          value: "$itemActivity",
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
                    const productnameOpt = await productNameModel.aggregate([
                      { 
                        $project: {
                          label: 1, 
                          value: "$productName",
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
                    const ownerOpt = await ownerModel.aggregate([
                      { 
                        $project: {
                          label: 1, 
                          value: "$owner",
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
                    const statusOpt = await statusModel.aggregate([
                      { 
                        $project: {
                          label: 1, 
                          value: "$status",
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
    itemActivity: itemOpt,
    productName: productnameOpt,
    owner: ownerOpt,
    status: statusOpt,
  }
  const disabledFields = [];
  const cloneField = structuredClone(technicalFormFields);
  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);
  return formData;
});


//@desc save Users
//@route POST /api/save
//@access private
const saveTechnical = asyncHandler(async (req, res) => {
    const data = req.body;   
    const user = await TechnicalModel.create(data);    
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
const getTechnical = asyncHandler(async (req, res) => {
  const users = await TechnicalModel.find().sort({ createdAt: -1 });
  if (users) {
    res.status(201).json(users);
  }
});

//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const updateTechnical = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = req.body._id; 
  const updatedUser = await TechnicalModel.findByIdAndUpdate(id, data, { new: true });
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
const deleteTechnical = asyncHandler(async (req, res) => {
  try {
      const id  = req.params.id; 
      const deletedUser = await TechnicalModel.deleteOne({_id:id});     
      const loggerData = {
        updatedData: deletedUser,
      }
      loggerService.info(`deleted with ID: ${id}`);
      res.success( "deleted successfully.");
  } catch (error) {
      return res.error("An error occurred while creating Incident.", constants.SERVER_ERROR);
  }
});


module.exports = { getTechnical, updateTechnical, deleteTechnical, saveTechnical, generateForm};
