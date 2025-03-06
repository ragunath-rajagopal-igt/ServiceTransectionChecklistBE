const asyncHandler = require("express-async-handler");
const moduleRolePermissionModel = require("../models/moduleRolePermissionModel");
//@desc get permission using role

//@access public
const userModulePermission = asyncHandler(async (role) => {
   const modulePermission = await moduleRolePermissionModel.findOne({ roleCode: role.code, isArchive: false });
   return modulePermission;
});

module.exports = { userModulePermission };