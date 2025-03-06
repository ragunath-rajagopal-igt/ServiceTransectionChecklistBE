// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const roleModel = require("../models/roleModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedRole = async () => {
    await connectDb(); // Ensure the database connection is established before running

    try {
        const role = [
            { code: "PM", name: "Project Manager", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "PMO", name: "Project Management Officer", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        await roleModel.deleteMany({});
        await roleModel.insertMany(role);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};

// Export the function for use with runSeeders.js
module.exports = seedRole;

// If the script is run directly, execute the function
if (require.main === module) {
    seedRole();
}