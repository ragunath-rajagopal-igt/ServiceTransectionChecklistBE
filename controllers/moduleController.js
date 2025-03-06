const asyncHandler = require("express-async-handler");
const moduleModel = require("../models/moduleModel");
//@desc get modules

//@access public
const allModules = asyncHandler(async () => {
   const modules = await moduleModel.find({ isArchive: false }, {code: 1});
   let modulesCode = modules.map(a => a.code);

   return modulesCode;
});

module.exports = { allModules };