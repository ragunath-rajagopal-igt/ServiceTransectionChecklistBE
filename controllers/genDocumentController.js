const asyncHandler = require("express-async-handler");
const { constant } = require("../utils/constant");
const { createLogger } = require('../utils/loggerService')
const { createFormFieldFromJSON } = require('../utils/formFieldHandler');
const loggerService = createLogger('Impact');
const constructuralModel = require("../models/constructuralModel");
const DataManagementModel = require("../models/dataManagementModel");
const operationModel = require("../models/operationsModel");
const serviceMangModel = require("../models/serviceManagementModel");
const technicalModel = require("../models/technicalModel");

//@desc Get Users
//@route GET /api/user/list
//@access private
async function getGenDocmentListData(siteName) {
  try {
    const name = siteName;
    const constructural = await constructuralModel.find({siteName : name}).sort({severity: 1 });
    const dataManagement = await DataManagementModel.find({siteName : name}).sort({severity: 1 });
    const operations = await operationModel.find({siteName : name}).sort({severity: 1 });
    const service = await serviceMangModel.find({siteName : name}).sort({severity: 1 });
    const techni = await technicalModel.find({siteName : name}).sort({severity: 1 });
    return {
      constructural,
      dataManagement,
      operations,
      service,
      techni
    };
  } catch (err) {
    console.error("Error retrieving data: ", err);
    throw err;
  }
}

//@desc Get Users
//@route GET /api/user/list
//@access private
const getGenDocmentList = asyncHandler(async (req, res) => {
  try {
    const siteName = req.headers['sitename']; 
    const data = await getGenDocmentListData(siteName);
    res.json(data); // Send the data as a JSON response
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve data" });
  }
});

module.exports = { getGenDocmentList };
