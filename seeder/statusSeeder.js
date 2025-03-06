// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const statusModel = require("../models/statusModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedStatus = async () => {
    await connectDb();

    try {
        const status = [
            { code: "created", name: "Created", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "submitted", name: "Submitted", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "approved", name: "Approved", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "sent_to_generate_activity", name: "Sent to generate activity", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "referred_back", name: "Referred Back", createdBy: ADMINID, updatedBy: ADMINID },
            { code: "generated", name: "generated", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        await statusModel.deleteMany({});
        await statusModel.insertMany(status);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};

// Export the function for use with runSeeders.js
module.exports = seedStatus;

// If the script is run directly, execute the function
if (require.main === module) {
    seedStatus();
}