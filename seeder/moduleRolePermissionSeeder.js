// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moduleRolePermissionModel = require("../models/moduleRolePermissionModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedModuleRolePermission = async () => {
    await connectDb(); // Ensure the database connection is established before running

    try {
        const role = [
            {
                roleCode: "PMO",
                moduleCode: ["dashboard", "contractual", "data-management", "operations", "service-management", "technical"],
                createdBy: ADMINID,
                updatedBy: ADMINID
            },
            {
                roleCode: "PM",
                moduleCode: ["hire", "project-movement", "inactivate", "reactivate", "terminate"],
                createdBy: ADMINID,
                updatedBy: ADMINID
            }
        ];

        await moduleRolePermissionModel.deleteMany({});
        await moduleRolePermissionModel.insertMany(role);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};


// Export the function for use with runSeeders.js
module.exports = seedModuleRolePermission;

// If the script is run directly, execute the function
if (require.main === module) {
    seedModuleRolePermission();
}