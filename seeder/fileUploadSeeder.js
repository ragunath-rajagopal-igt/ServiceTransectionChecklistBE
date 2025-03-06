const mongoose = require("mongoose");
const FileUpload = require("../models/fileUploadModel"); // Adjust the path as necessary

// Connect to MongoDB
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;

const seedData = [
    {
        newHireId: "HIRE001",
        filepath: "uploads/file1.pdf",
        isArchive: false,
        createdBy: ADMINID,
        updatedBy: ADMINID,
    },
    {
        newHireId: "HIRE002",
        filepath: "uploads/file2.pdf",
        isArchive: false,
        createdBy: ADMINID,
        updatedBy: ADMINID,
    },
    {
        newHireId: "HIRE003",
        filepath: "uploads/file3.pdf",
        isArchive: true,
        createdBy: ADMINID,
        updatedBy: ADMINID,
    },
];

const seederFileUpload = async () => {
    await connectDb(); // Ensure the database connection is established before running
  
    try {
        // Clear existing data
        await FileUpload.deleteMany();

        // Insert new data
        await FileUpload.insertMany(seedData);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};


// Export the function for use with runSeeders.js
module.exports = seederFileUpload;

// If the script is run directly, execute the function
if (require.main === module) {
    seederFileUpload();
}
