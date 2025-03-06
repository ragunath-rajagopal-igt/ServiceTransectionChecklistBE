// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const moduleModel = require("../models/moduleModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedModule = async () => {
    await connectDb(); // Ensure the database connection is established before running

    try {
        const module = [
            { code: "dashboard", name: "Dashboard", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "contractual", name: "Contractual", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "data-management", name: "Data Management", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "operations", name: "Operations", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "service-management", name: "Service Management", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "technical", name: "Technical", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        await moduleModel.deleteMany({});
        await moduleModel.insertMany(module);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};

// Export the function for use with runSeeders.js
module.exports = seedModule;

// If the script is run directly, execute the function
if (require.main === module) {
    seedModule();
}