const asyncHandler = require("express-async-handler");
const UserModel = require("../models/userModel");
// const subLocation = require("../models/locationSubCategoryModel");
// const locationModel = require("../models/locationCategoryModel");
// const organizationModel = require("../models/organizationModel");
const { constants } = require("../utils/constants");
// const { createLogger } = require('../utils/loggerService')
const { makeInputObj, createFormFieldFromJSON } = require('../utils/formFieldHandler');
// const { logAction } = require("./loggerController");

// const loggerService = createLogger('User');

const userFormFields = require('../formFields/userFields.json');
// const { getLocationsWithValues } = require("./locationController");
// const { checkUserExists } = require("../utils/helper");
// const networkSetupModel = require("../models/networkSetupModel");
// const { getLgetManagerDetailsOptions } = require("./managerDetailsController");

const MODULE_NAME = constants.LOGGER_MODULE.user;

//@desc Add User
//@route POST /api/user/create
//@access private
const createUser = asyncHandler(async (req, res) => {
  try {
    await req.body;

    const categories = await locationModel.find()
    .select({ _id: 1, code: 1, category: 1 }) // Selecting only _id, code, and category
    .exec();

    // Map the results to include category as "label"
    const locationOpt = categories.map(category => ({
      value: category.category,
      key: category.code
    }));
    let setResponse = await generateUserFormBuild('', locationOpt);     
    res.json({renderData:setResponse});
  }
  catch(error){
    res.status(400).json(req.body);
    res.error("User creation failed", constants.VALIDATION_ERROR);
  }
});

//@desc Edit User
//@route POST /api/user/edit
//@access private
const generateForm = asyncHandler(async (req, res) => {
  try {
    let user = {};
    const existingFormValue = req?.body || {};

    if (req.body && req.body.id && !existingFormValue.hclSapNo) {
      user = await UserModel.findOne({ _id: req.body.id });
    } else {
      const { hclSapNo } = req.body || '';
      // fetch the user data and bind the user if rehiring
      const terminatedUser = await UserModel.findOne({ hclSapNo: hclSapNo, isArchive: false }).sort({ createdAt: -1 });
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
    res.error("User creation failed", constants.VALIDATION_ERROR);
  }
});


//@desc Add and Edit User
const generateUserFormBuild = asyncHandler(async(user) => {

  const [ locationOpt, subLocationOpt ] = await getLocationsWithValues(user);

  const managerDetailsOpt = await getLgetManagerDetailsOptions();

  const dynamicOptions = {
    location: locationOpt,
    subLocation: subLocationOpt,
    gender: constants.genderOptions,
    hclReportingManagerSapNo: managerDetailsOpt,
  }

  const disabledFields = [];

  if (user._id) {
    disabledFields.push('hclSapNo');
  }

  const cloneField = structuredClone(userFormFields);

  const attributeFields = {
    disabledFields,
  };
  const formData = await createFormFieldFromJSON(cloneField, dynamicOptions, user, attributeFields);

  return formData;
});


//@desc save Users
//@route POST /api/save
//@access private
const saveUser = asyncHandler(async (req, res) => {
    const data = req.body;
    const { id: createdBy } = req.user;
    const organizationCode = req.organizationCode;
    data.status = constants.STATUS.created;
    data.organizationCode = organizationCode;
    data.createdBy = createdBy;

    const {
      hclSapNo
    } = req.body;
    // Input Validation
    if (!hclSapNo) {
        return res.error("All required fields must be filled!", constants.VALIDATION_ERROR);
    }

    // Check if user already exists with the same HCL SAP number
    const existingUser = await UserModel.findOne({ hclSapNo, isArchive: false, isTerminated: false });
    if (existingUser) {
      let orgErrorMsg = "User with HCL SAP number already exists";
      if (existingUser.organizationCode !== organizationCode) {
        const orgData = await organizationModel.findOne({ code: existingUser.organizationCode, isArchive: 0});
        orgErrorMsg = `User with HCL SAP number is active in ${orgData?.name || 'different' } organization`;
      }
      return res.error(orgErrorMsg, constants.VALIDATION_ERROR);
    }

    // fetch the user data and bind the user if rehiring
    const terminatedUser = await UserModel.findOne({ hclSapNo: hclSapNo, isArchive: false }).sort({ createdAt: -1 });
    if (terminatedUser && terminatedUser.isTerminated === true) {
      data.igtId = terminatedUser?.igtId || '';
      data.igtEmailId = terminatedUser?.igtEmailId || '';
      data.igtUserId = terminatedUser?.igtUserId || '';
    }

    const user = await UserModel.create(data);
    
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

    if (user) {
      res.status(201).json({ message: "User Created Successfully"});
    } else {
      res.status(400).json(req.body);
      // throw new Error("All fields are mandatory!");
      res.error("User creation failed", constants.VALIDATION_ERROR);
    }
});

//@desc Get Users
//@route GET /api/user/list
//@access private
const getUsers = asyncHandler(async (req, res) => {
  const { id: createdBy } = req.user;
  const users = await UserModel.find({ organizationCode: req.organizationCode, isArchive: 0, isTerminated: 0, createdBy: createdBy }).sort({ createdAt: -1 }).limit(10);

  if (users) {
    res.status(201).json(users);
  }
});

//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const updateUser = asyncHandler(async (req, res) => {
  const data = req.body;
  const id = req.body._id;
  const {
    hclSapNo
  } = req.body;
  const organizationCode = req.organizationCode;
  const { id: updatedBy } = req.user;

  // Check if user already exists with the same HCL SAP number
  const existingUser = await UserModel.findOne({ hclSapNo, isArchive: 0, isTerminated: 0});
  if (existingUser && id !== existingUser.id) {
    let orgErrorMsg = "User with HCL SAP number already exists";
    if (existingUser.organizationCode !== organizationCode) {
      const orgData = await organizationModel.findOne({ code: organizationCode, isArchive: 0});
      orgErrorMsg = `User with HCL SAP number is active in ${orgData?.name || 'different' } organization`;
    }
    return res.error(orgErrorMsg, constants.VALIDATION_ERROR);
  }

  const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true });

  // Logger Data
  const loggerData = {
    recordId: id,
    currentData: existingUser,
    updatedData: updatedUser,
    module: MODULE_NAME,
    action: constants.LOGGER_ACTION.update,
    createdBy: updatedBy,
  }
  logAction(loggerData);

  if (updatedUser) {
    res.status(201).json({message:'Update Successfully'});
  } else {
    res.status(400).json(req.body);
    throw new Error("All fields are mandatory!");
  }
});


//@desc Update User
//@route PUT /api/auth/updateuser
//@access private
const subLocationuser = asyncHandler(async (req, res) => {
  try {
    const subLocation = await subLocation.find();
    res.json({renderData:'2'});
  }
  catch(error){
    res.status(400).json(req.body);
    res.error("User creation failed", constants.VALIDATION_ERROR);
  }

});


// @desc Delete user by ID
// @route DELETE /api/user/delete/:id
// @access Private
const deleteNewUser = asyncHandler(async (req, res) => {
  try {
      const id  = req.params.id; // Get the ID from the URL parameters
      const { id: updatedBy } = req.user;

      loggerService.info(`User delete request for ID: ${id}`);
      // Check if user exists by ID
      const existinUser = await UserModel.findById(id);
      if (!existinUser) {
          return res.error("User setup not found.", constants.VALIDATION_ERROR);
      }

      // Check if network setup exists by ID
      const existingNS = await networkSetupModel.findOne({ userId: id, isArchive: false});
      if (existingNS) {
        return res.error("Can't delete this user, Network setup is created.", constants.VALIDATION_ERROR);
      }
      const deletedUser = await UserModel.findByIdAndUpdate(
          id,
          {
            isArchive: true,
            updatedBy: updatedBy,
          },
          { new: true } // Return the updated document
      );
          
      // Logger Data
      const loggerData = {
        recordId: id,
        currentData: existinUser,
        updatedData: deletedUser,
        module: MODULE_NAME,
        action: constants.LOGGER_ACTION.delete,
        createdBy: updatedBy,
      }
      logAction(loggerData);

      // Log the deletion
      loggerService.info(`User deleted with ID: ${id}`);
      res.success( "User deleted successfully.");
  } catch (error) {
      // Log the error
      loggerService.error(`Error deleting User: `, { 
        message: error.message, 
        stack: error.stack,
      });

      return res.error("An error occurred while creating User.", constants.SERVER_ERROR);
  }
});


//@desc Generate form fields
//@route GET /api/user/igt-id-email-form
//@access Private
const generateIGTIdAndEmailForm = asyncHandler(async (req, res) => {
  try {
      loggerService.info("Generating forms for Update IGT Id and Email");
      
      let user = {};
      let userExist = false;
      let userId = '';
      const organizationCode = req?.organizationCode || '';
      if (req.body && req.body.hclSapNo) {
        const [isUserExistDb, userDBData] = await checkUserExists({ hclSapNo: req.body.hclSapNo, organizationCode });
        user = userDBData;
        if (isUserExistDb && userDBData.id) {
          userExist = true;
          userId = user.id;
          
          // Append igt id & email from existing data when user added after terminated.
          const userTerminatedData = await UserModel.findOne({ hclSapNo: req.body.hclSapNo, isArchive: false, isTerminated: true }).sort({ createdAt: -1 });
          if (!user.igtId && userTerminatedData && userTerminatedData.igtId !== '') {
            user.igtId = userTerminatedData.igtId
          }
          if (!user.igtEmailId && userTerminatedData && userTerminatedData.igtEmailId !== '') {
            user.igtEmailId = userTerminatedData.igtEmailId
          }
        } else {
          userId = '';
          user = {
            hclSapNo: req.body.hclSapNo
          };
          loggerService.info("Given hcl sap number is not exist", req.body);
          return res.error("Given hcl sap number is not exist in user", constants.VALIDATION_ERROR);
        }
      } else {
        user.organizationCode = organizationCode;
      }
      const formData = await generateFormFieldAndValuesIGT(user, userExist);
      
      res.success({ userId, formData }, "Update IGT Id and Email form generated successfully");
  } catch (error) {
      loggerService.error(`Error generating Update IGT Id and Email form: `, { 
        message: error.message, 
        stack: error.stack,
      });
      res.error("Update IGT Id and Email form generation failed", constants.SERVER_ERROR);
  }
});

const generateFormFieldAndValuesIGT = asyncHandler(async (user, userExist) => {
  const formFields = [];

  const hclSapNoInput = makeInputObj({
    label: 'HCL SAP No.',
    formCtrlName: 'hclSapNo',
    value: user?.hclSapNo || '',
    styleClass: 'col-md-12 mb-3',
    placeholder: '',
    required: true,
    maxLen: 8,
    validMsg: {
        required: 'HCL SAP No is required',
        maxLength: "HCL SAP No. must be 8 digits"
    },
  });
  formFields.push(hclSapNoInput);

  const nameInput = makeInputObj({
    label: 'Name',
    formCtrlName: 'name',
    value: user?.name || '',
    styleClass: 'col-md-6 mb-3',
    placeholder: '',
    required: false,
    disabled: true,
    maxLen: 8,
    validMsg: {
        required: 'Name is required',
    },
  });
  formFields.push(nameInput);

  const hclEmailInput = makeInputObj({
    label: 'HCL Email',
    formCtrlName: 'hclEmail',
    value: user?.hclEmail || '',
    styleClass: 'col-md-6 mb-3',
    placeholder: '',
    required: false,
    disabled: true,
    maxLen: 8,
    validMsg: {
        required: 'HCL Email is required',
    },
  });
  formFields.push(hclEmailInput);
 
  // Show igt id field if org no gaming
  if (user.organizationCode && user.organizationCode !== constants.organization.gamingCode) {
    const igtIdInput = makeInputObj({
        label: 'IGT Id.',
        formCtrlName: 'igtId',
        value: user?.igtId || '',
        styleClass: 'col-md-12 mb-3',
        placeholder: '',
        required: true,
        disabled: userExist ? false : true,
        type: 'number',
        maxLen: 8,
        validMsg: {
            required: 'IGT id is required',
            maxLength: "IGT id must be 8 digits",
        },
    });
    formFields.push(igtIdInput);
  }

  const igtUserIdInput = makeInputObj({
    label: 'IGT User Id.',
    formCtrlName: 'igtUserId',
    value: user?.igtUserId || '',
    styleClass: 'col-md-12 mb-3',
    placeholder: '',
    required: true,
    disabled: userExist ? false : true,
    type: 'text',
    validMsg: {
        required: 'IGT User id is required',
        maxLength: "IGT User id must be 8 digits",
    },
  });
  formFields.push(igtUserIdInput);
  
  const igtEmailId = makeInputObj({
      label: 'IGT Email Id.',
      formCtrlName: 'igtEmailId',
      value: user?.igtEmailId || '',
      styleClass: 'col-md-12 mb-3',
      placeholder: '',
      required: true,
      disabled: userExist ? false : true,
      type: 'email',
      validMsg: {
          required: 'IGT Email id is required',
          email: "Please enter a valid email address."
      },
  });
  formFields.push(igtEmailId);
  return formFields;
});


// @desc Update igtId and email in user by ID
// @route PATCH /api/user/update/igt-email/:id
// @access Private
const updateIgtIdAndEmail = asyncHandler(async (req, res) => {
  try {
      const { id, igtId, igtEmailId, igtUserId } = req.body; // Extract igtId and email from the request body
      const { id: updatedBy } = req.user;
      let existingLogData = null;

      loggerService.info(`Update request for igtId and email for user: ${id}`, req.body);

      // Input Validation
      if (!igtEmailId || !igtUserId || (!igtId && req.organizationCode !== constants.organization.gamingCode)) {
          return res.error("All are required fields!", constants.VALIDATION_ERROR);
      }

      // Check if the user exists by ID
      const existingUser = await UserModel.findById(id);
      if (!existingUser) {
          return res.error("User not found.", constants.VALIDATION_ERROR);
      } else {
        existingLogData = {
          igtId: existingUser.igtId, igtEmailId: existingUser.igtEmailId
        };
      }

      // Update the user with the new igtId and email
      existingUser.igtId = igtId || '';
      existingUser.igtEmailId = igtEmailId;
      existingUser.igtUserId = igtUserId;
      existingUser.updatedBy = updatedBy;
      
      const updateUser = await existingUser.save(); // Save the updated document

      // Logger Data
      const loggerData = {
        recordId: id,
        currentData: existingLogData,
        updatedData: { igtId, igtEmailId, igtUserId },
        module: MODULE_NAME,
        action: constants.LOGGER_ACTION.update,
        createdBy: updatedBy,
      }
      logAction(loggerData);

      // Log the update
      loggerService.info(`User updated with ID: ${id}, new igtId: ${igtId}, new email: ${igtEmailId}`);
      res.success({ existingUser }, "User IGT id & email updated successfully.");
  } catch (error) {
      // Log the error
      loggerService.error(`Error updating User: `, { 
        message: error.message, 
        stack: error.stack,
      });
      return res.error("An error occurred while udpating user.", constants.SERVER_ERROR);
  }
});

// update user status
const updateUserStatus = asyncHandler(async (req, res) => {
	try {
		const { status } = req.body;
		const id = req.params.id;
		const existingUser = await UserModel.findById(id);
		if (!existingUser) {
			return res.error("User not found.", constants.VALIDATION_ERROR);
		}

		const { id: updatedBy } = req.user;
		const updateUser = await UserModel.findByIdAndUpdate(
			id, {
				status: status,
				updatedBy: updatedBy
			}, {
				new: true
			} // Return the updated document
		);

		if (updateUser) {
			// Logger Data
			const loggerData = {
				recordId: id,
				currentData: existingUser,
				updatedData: updateUser,
				module: MODULE_NAME,
				action: constants.LOGGER_ACTION.update,
				createdBy: updatedBy,
			}
			logAction(loggerData);
			res.status(201).json({
				message: 'Updated Successfully'
			})

			// Log the creation
			loggerService.info(`New User status updated: ID ${id} `);
			res.success({
				updateHire
			}, "Updated successfully");
		} else {
			res.error("Error updating status", constants.NOCONTENT)
		}

	} catch (error) {
		// Log the error and send a server error response
		loggerService.error("Error updateing user status:", {
			message: error.message,
			stack: error.stack,
		});
		res.error("Error updateing user status", constants.VALIDATION_ERROR, error);
	}
});

module.exports = { createUser, getUsers, updateUser, deleteNewUser, saveUser, generateForm, subLocationuser, generateIGTIdAndEmailForm, updateIgtIdAndEmail, updateUserStatus};
