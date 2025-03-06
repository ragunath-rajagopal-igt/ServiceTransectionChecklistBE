// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const organizationModel = require("../models/organizationModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedOrganization = async () => {
    await connectDb(); // Ensure the database connection is established before running

    try {
        const organization = [
            { code: "01", name: "Lottery (RI)", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "1000", name: "Gaming (NV)", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        await organizationModel.deleteMany({});
        await organizationModel.insertMany(organization);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};

// Export the function for use with runSeeders.js
module.exports = seedOrganization;

// If the script is run directly, execute the function
if (require.main === module) {
    seedOrganization();
}