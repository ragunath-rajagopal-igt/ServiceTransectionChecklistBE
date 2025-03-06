// utils/userUtils.js
const asyncHandler = require("express-async-handler");
const userModel = require("../models/userModel"); // Adjust the path based on your project structure
const networkSetupModel = require('../models/networkSetupModel');
const newHireModel = require('../models/newHireModel');
const { constants } = require("./constants");
const inactivateModel = require("../models/inactivateModel");

const { fileUploadBasedModule } = require('../utils/fileUploadHandler.js');
const locationTransferModel = require("../models/locationTransferModel.js");
const reactivateModel = require("../models/reactivateModel.js");
const { getFileDetails } = fileUploadBasedModule('');

// Check if user exists by hclSapNo & Organization
const checkUserExists = async ({organizationCode, hclSapNo}) => {
    const user = await userModel.findOne({ hclSapNo, organizationCode, isArchive: false, isTerminated: false }).sort({ createdAt: -1 });
    let isUserExistCheck = false;
    if (user && user._id) {
        isUserExistCheck = true
    } 
    return [isUserExistCheck, user];
};

// Check if user exists by id
const checkUserExistsById = async ({userId}) => {
    const user = await userModel.findOne({ _id: userId, isArchive: false, isTerminated: false }).sort({ createdAt: -1 });
    let isUserExistCheck = false;
    if (user && user._id) {
        isUserExistCheck = true
    } 
    return [isUserExistCheck, user];
};

// Check if network setup exists by userId
const checkNetworkSetupExistsByUserId = async ({userId}) => {
    const networkSetup = await networkSetupModel.findOne({ userId: userId, isArchive: false }).sort({ createdAt: -1 });
    let isNetworkSetupCheck = false;
    let isStatusGenerated = false;
    if (networkSetup && networkSetup._id) {
        isNetworkSetupCheck = true
    }
    if (networkSetup && networkSetup.status === constants.STATUS.generated) {
        isStatusGenerated = true;
    }
    return [isNetworkSetupCheck, networkSetup, isStatusGenerated];
};

// Check if network setup exists by hclSapNo & organizationCode
const checkNetworkSetupExists = async ({organizationCode, hclSapNo}) => {
    const networkSetup = await networkSetupModel.findOne({ hclSapNo, organizationCode, isArchive: false }).sort({ createdAt: -1 });
    let isNetworkSetupCheck = false;
    let isStatusGenerated = false;
    if (networkSetup && networkSetup._id) {
        isNetworkSetupCheck = true
    }
    if (networkSetup && networkSetup.status === constants.STATUS.generated) {
        isStatusGenerated = true;
    }
    return [isNetworkSetupCheck, networkSetup, isStatusGenerated];
};

// Check if new hire exists by hclSapNo & organizationCode
const checkNewHireExistsByUserId = async ({userId}) => {
    const newHire = await newHireModel.findOne({ userId: userId, isArchive: false }).sort({ createdAt: -1 });
    let isNewHireCheck = false;
    if (newHire && newHire._id) {
        isNewHireCheck = true
    } 
    return [isNewHireCheck, newHire];
};

// Check if new hire exists by hclSapNo & organizationCode
const checkNewHireExists = async ({organizationCode, hclSapNo}) => {
    const newHire = await newHireModel.findOne({ hclSapNo, organizationCode, isArchive: false }).sort({ createdAt: -1 });
    let isNewHireCheck = false;
    if (newHire && newHire._id) {
        isNewHireCheck = true
    } 
    return [isNewHireCheck, newHire];
};

// Check if new hire exists by hclSapNo & organizationCode
const checkNewHireExistsWithUserActive = async ({organizationCode, hclSapNo}) => {
    let newHire = null;
    let isNewHireCheck = false;
    let isNewHireGenerated = false;
    // Check if user is terminated then return false as to restrict creation
    const [isUserExist, user] = await checkUserExists({organizationCode, hclSapNo});
    if (!isUserExist || !user._id) {
        isNewHireCheck = false;
        newHire = null;
    } else {
        newHire = await newHireModel.findOne({ userId: user.id, isArchive: false }).sort({ createdAt: -1 });
        if (newHire && newHire._id) {
            isNewHireCheck = true
        } 
        
        if (newHire && newHire.status && newHire.status === constants.STATUS.generated) {
            isNewHireGenerated = true
        } 
    }

    return [isNewHireCheck, newHire, isNewHireGenerated];
};

// Check if inactivate exists by hclSapNo & organizationCode
const checkInactivateExists = async ({organizationCode, hclSapNo}) => {
    const [isUserExist, user] = await checkUserExists({organizationCode, hclSapNo});
    if (!isUserExist || !user._id) {
        return [false, null];
    } else {
        const inactivate = await inactivateModel.findOne({ userId: user.id, isArchive: false }).sort({ createdAt: -1 });
        let isInactivateCheck = false;
        if (inactivate && inactivate._id) {
            isInactivateCheck = true;
        } 
        return [isInactivateCheck, inactivate];
    }
};

// Check if inactivate exists by hclSapNo & organizationCode
const checkReactivateExists = async ({organizationCode, hclSapNo}) => {
    const [isUserExist, user] = await checkUserExists({organizationCode, hclSapNo});
    if (!isUserExist || !user._id) {
        return [false, null];
    } else {
        const reactivate = await reactivateModel.findOne({ userId: user.id, isArchive: false }).sort({ createdAt: -1 });
        let isReactivateCheck = false;
        if (reactivate && reactivate._id) {
            isReactivateCheck = true;
        } 
        return [isReactivateCheck, reactivate];
    }
};

// Check if location transfer exists by hclSapNo & organizationCode
const checkLocationTransferExists = async ({organizationCode, hclSapNo}) => {
    // Check if user is terminated then return false as to restrict creation
    const [isUserExist, user] = await checkUserExists({organizationCode, hclSapNo});
    if (!isUserExist || !user._id) {
        return [false, null];
    } else {
        const locationTransfer = await locationTransferModel.findOne({ userId: user.id, isArchive: false }).sort({ createdAt: -1 });
        let isLTCheck = false;
        if (locationTransfer && locationTransfer._id) {
            isLTCheck = true
        } 
        return [isLTCheck, locationTransfer];
    }
};

// Check if network setup exists by hclSapNo & organizationCode
const checkNetworkSetupExistsWithUserActive = async ({ organizationCode, hclSapNo }) => {

    let networkSetup = null;
    let isNetworkSetupCheck = false;
    let isStatusGenerated = false;

    //check if user is terminated then return false as to restrict creation
    const [isUserExist, user] = await checkUserExists({ organizationCode, hclSapNo });
    if (!isUserExist || !user._id) {
        isNetworkSetupCheck = false;
        networkSetup = null;
    } else {
        networkSetup = await networkSetupModel.findOne({ userId: user.id, isArchive: false }).sort({ createdAt: -1 });
        //console.log('2----->',networkSetup);
        if (networkSetup && networkSetup._id) {
            isNetworkSetupCheck = true;
        }
        if (networkSetup && networkSetup.status === constants.STATUS.generated) {
            isStatusGenerated = true;
        }

    }

    return [isNetworkSetupCheck, networkSetup, isStatusGenerated, user];
};

const checkIGTIdAndMail = async ({ organizationCode, user }) => {

    let igtId = user.igtId || '';
    let igtUserId = user.igtUserId || '';
    let igtEmailId = user.igtEmailId || '';

    if (organizationCode == constants.organization.gamingCode && igtUserId != '' && igtEmailId != '') {
        return true;
    } else if (igtId != '' && igtUserId != '' && igtEmailId != '') {
        return true;
    } else {
        return false;
    }
}

/**
 * @desc Generic function to fetch records based on user role and criteria, with aggregation for user data
 * @param {Object} model - Mongoose model to query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} loggerService - Logger service instance for logging
 * @param {Object} criteria - Additional criteria to match records
 * @param {String} orgCodeField - Field name representing organization code in the model (default: 'organizationCode')
 * @param {String} isArchiveField - Field name representing archive status in the model (default: 'isArchive')
 * @param {String} userField - Field name to use for the lookup (e.g., 'createdBy')
 * @param {Object} projectFields - Fields to include in the aggregation `$project` stage
 */
const getRecordsByRole = asyncHandler(async (
    model,
    req,
    res,
    loggerService,
    criteria = {},
    userField = true,
    projectFields = {},
) => {
    try {
        const userFieldCollection = 'auths';
        loggerService.info("Fetching records", { user: req.user });

        const { user: currentUser } = req || {};
        const { role: currentUserRole } = currentUser || {};
        const { id: createdBy } = currentUser || '';
        let records = [];

        // Base criteria to fetch non-archived records from the given organization
        const baseCriteria = {
            organizationCode: req.organizationCode,
            isArchive: false, // Assuming isArchive is a boolean
            ...criteria
        };

        // Determine fetch logic based on user role
        if (currentUserRole?.code === constants.ROLE_CODE.pm) {
            // Fetch records created by the current project manager
            loggerService.info("Fetching records for Project Manager", { createdBy });
            records = await model.find({
                ...baseCriteria,
                createdBy: createdBy
            }).sort({ createdAt: -1 });
        } else {
            // Fetch records created by the current user or with specific statuses
            loggerService.info("Fetching records for general user", { createdBy, statuses: [constants.STATUS.submitted, constants.STATUS.approved] });
            records = await model.find({
                ...baseCriteria,
                $and: [
                    {
                        $or: [
                            { createdBy: { $eq: createdBy } },
                            { status: { $eq: constants.STATUS.submitted } },
                            { status: { $eq: constants.STATUS.approved } }
                        ]
                    },
                    { status: { $ne: constants.STATUS.sentToActivity } },
                    { status: { $ne: constants.STATUS.generated } },
                ],
            }).sort({ createdAt: -1 });
        }

        // If no records found, return an appropriate response
        if (records.length === 0) {
            res.success({},"No records found");
            loggerService.warn("No records found for criteria", { criteria: baseCriteria });
            return;
        }

        let listData = records;
        if (userField !== false) {
            // Perform aggregation to get user data
            const recordsWithUserAggregation = await model.aggregate([
                {
                    $addFields: {
                        createdBy: { $toObjectId: `$createdBy` },
                        userId: { $toObjectId: `$userId` }
                    }
                },
                {
                    $match: { _id: { $in: records.map(record => record._id) } } // Match the filtered records
                },
                {
                    $lookup: {
                        from: 'auths', // Collection name of the User model
                        localField: 'createdBy',
                        foreignField: '_id',
                        as: 'createdInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$createdInfo",
                        preserveNullAndEmptyArrays: true // Include records even if there's no user data
                    }
                },
                
                {
                    $lookup: {
                        from: 'users', // Collection name of the User model
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$userInfo",
                        preserveNullAndEmptyArrays: true // Include records even if there's no user data
                    }
                },
                {
                    $project: {
                        ...projectFields,
                        createdByName: "$createdInfo.username",
                        createdByEmail: "$createdInfo.email"
                    } // Dynamically project the fields
                },
            ]);
            listData = recordsWithUserAggregation;
        }

        // Check if aggregated records were found
        res.success({ list: listData }, "Records retrieved successfully.");
        loggerService.info("Records fetched successfully", { count: listData.length });

    } catch (error) {
        // Log the error and return a structured error response
        loggerService.error("Failed to fetch records", {
            message: error.message,
            stack: error.stack
        });
        res.error("An error occurred while fetching records", constants.SERVER_ERROR);
    }
});


/**
 * @desc Generic function to fetch records based on user role and criteria, with aggregation for user data
 * @param {Object} model - Mongoose model to query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} loggerService - Logger service instance for logging
 * @param {Object} criteria - Additional criteria to match records
 * @param {String} orgCodeField - Field name representing organization code in the model (default: 'organizationCode')
 * @param {String} isArchiveField - Field name representing archive status in the model (default: 'isArchive')
 * @param {String} userField - Field name to use for the lookup (e.g., 'createdBy')
 * @param {Object} projectFields - Fields to include in the aggregation `$project` stage
 */
const getRecordsByRoleForActivity = asyncHandler(async (
    model,
    req,
    res,
    loggerService,
    criteria = {},
    userField = 'createdBy',
    projectFields = {},
) => {
    try {
        const userFieldCollection = 'auths';
        loggerService.info("Fetching records", { user: req.user });

        const { user: currentUser } = req || {};
        const { role: currentUserRole } = currentUser || {};
        const { id: createdBy } = currentUser || '';
        let records = [];

        // Base criteria to fetch non-archived records from the given organization
        const baseCriteria = {
            organizationCode: req.organizationCode,
            isArchive: false, // Assuming isArchive is a boolean
            ...criteria
        };

        // Determine fetch logic based on user role
        if (currentUserRole?.code === constants.ROLE_CODE.pm) {
            // Fetch records created by the current project manager
            loggerService.info("Fetching records for Project Manager", { createdBy });
            records = await model.find({
                ...baseCriteria,
                createdBy: createdBy,
            }).sort({ createdAt: -1 });
        } else {
            // Fetch records created by the current user or with specific statuses
            loggerService.info("Fetching records for general user", { createdBy, statuses: [constants.STATUS.submitted, constants.STATUS.approved] });
            records = await model.find({
                ...baseCriteria,
                $and: [
                    { status: { $eq: constants.STATUS.sentToActivity } },
                ]
            }).sort({ createdAt: -1 });
        }

        // If no records found, return an appropriate response
        if (records.length === 0) {
            res.success({},"No records found");
            loggerService.warn("No records found for criteria", { criteria: baseCriteria });
            return;
        }

        let listData = records;
        if (userField !== '') {
            // Perform aggregation to get user data
            const recordsWithUserAggregation = await model.aggregate([
                {
                    $addFields: {
                        [userField]: { $toObjectId: `$${userField}` }
                    }
                },
                {
                    $match: { _id: { $in: records.map(record => record._id) } } // Match the filtered records
                },
                {
                    $lookup: {
                        from: userFieldCollection, // Collection name of the User model
                        localField: userField,
                        foreignField: '_id',
                        as: 'userFieldInfo'
                    }
                },
                {
                    $unwind: {
                        path: "$userFieldInfo",
                        preserveNullAndEmptyArrays: true // Include records even if there's no user data
                    }
                },
                {
                    $project: projectFields // Dynamically project the fields
                }
            ]);
            listData = recordsWithUserAggregation;
        }

        // Check if aggregated records were found
        res.success({ list: listData }, "Records retrieved successfully.");
        loggerService.info("Records fetched successfully", { count: listData.length });

    } catch (error) {
        // Log the error and return a structured error response
        loggerService.error("Failed to fetch records", {
            message: error.message,
            stack: error.stack
        });
        res.error("An error occurred while fetching records", constants.SERVER_ERROR);
    }
});

// Get network setup with user
const getNetworkSetupWithUser = asyncHandler(async (req, res) => {
    try {
        const networkSetups = await NetworkSetup.find({ isArchive: false })
            .populate({
                path: 'userId',
                model: 'user', // Reference to the User model
                select: 'name', // Select only the fields you need
            })
            .lean(); // Convert documents to plain JavaScript objects

        res.success({ networkSetups }, "Network setups retrieved successfully.");
    } catch (error) {
        loggerService.error("Error fetching network setups:", error);
        res.error("An error occurred while fetching network setups.", constants.SERVER_ERROR);
    }
});

/**
 * @desc Generic function to fetch records with user aggregation from any model
 * @param {Object} model - Mongoose model to query
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Object} matchCriteria - Criteria to match records
 * @param {String} userField - The field in the model to join with user data (e.g., 'userId')
 */
const getRecordsWithUserAggregation = asyncHandler(async (model, req, res, matchCriteria = { isArchive: false }, userField = 'userId') => {
    try {
        const records = await model.aggregate([
            {
                $match: matchCriteria // Match non-archived records or other criteria
            },
            {
                $lookup: {
                    from: 'users', // Collection name of the User model
                    localField: userField,
                    foreignField: '_id',
                    as: 'userInfo'
                }
            },
            {
                $unwind: {
                    path: "$userInfo",
                    preserveNullAndEmptyArrays: true // Include records even if there's no user data
                }
            },
            {
                $project: {
                    organizationCode: 1,
                    hclSapNo: 1,
                    location: 1,
                    dojOfIgt: 1,
                    igtReportingManager: 1,
                    comments: 1,
                    status: 1,
                    createdBy: 1,
                    "userInfo.name": 1,
                }
            }
        ]);

        res.success({ records }, "Records retrieved successfully.");
        loggerService.info("Records retrieved successfully", { count: records.length });
    } catch (error) {
        loggerService.error("Error fetching records:", { message: error.message, stack: error.stack });
        res.error("An error occurred while fetching records.", constants.SERVER_ERROR);
    }
});

/**
 * upload trip file
 */
const fileUploadData = asyncHandler(async (req, res) => {
    try {
      if (req.file) {
        const fileDetails = getFileDetails(req);
        res.json({ message: 'File uploaded successfully', file: fileDetails });
      } else {
        res.status(400).json({ message: 'File upload failed' });
      }
    } catch (error) {
      // Log the error
      return res.error("An error occurred while uploading file.", constants.SERVER_ERROR, error);
    }
});

//File download
const fileDownload = asyncHandler (async(req,res) =>{
    try {
       if(req.body && req.body.fullPath) {
        const name = req.body.originalName;
        const final = req.body.fullPath;
        res.download(final,{name},(err)=>{
            if(err){
                res.error("Error downloading file", constants.VALIDATION_ERROR);
            }
        });
       } else {
            res.error("File is required for download", constants.VALIDATION_ERROR);
       }
    } catch(error){
        return res.error("An error occurred while downloading file.", constants.SERVER_ERROR, error);
    }
})

module.exports = {
    checkUserExists,
    checkUserExistsById,
    checkNetworkSetupExists,
    checkNetworkSetupExistsByUserId,
    checkNewHireExists,
    checkNewHireExistsByUserId,
    getRecordsByRole,
    checkNewHireExistsWithUserActive,
    checkInactivateExists,
    fileUploadData,
    getRecordsByRoleForActivity,
    checkLocationTransferExists,
    checkReactivateExists,
    fileDownload,
    checkNetworkSetupExistsWithUserActive,
    checkIGTIdAndMail
};