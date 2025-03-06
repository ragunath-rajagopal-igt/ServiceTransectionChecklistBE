// seeders/admin-seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const LocationCategoryModel = require("../models/locationCategoryModel");
const LocationSubCategoryModel = require("../models/locationSubCategoryModel");
const connectDb = require("../config/dbConnection");

const ADMINID = process.env.ADMIN_ID;

const seedLocatinoCategories = async () => {
    await connectDb(); // Ensure the database connection is established before running

    try {
        const locationCategory = [
            { code: 1, category: "Onsite", createdBy: ADMINID, updatedBy: ADMINID },
            { code: 2, category: "Nearshore", createdBy: ADMINID, updatedBy: ADMINID },
            { code: 3, category: "Offshore", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        const locationSubCategory = [
            { categoryCode: 1, subCategory: "USA", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Luxembourg", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "NZ", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Australia", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "UK", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Spain", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Poland", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Singapore", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 1, subCategory: "Malaysia", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 2, subCategory: "Canada", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 2, subCategory: "Mexico", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 3, subCategory: "Chennai", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 3, subCategory: "Hyderabad", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 3, subCategory: "Madurai", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 3, subCategory: "Bangalore", createdBy: ADMINID, updatedBy: ADMINID },
            { categoryCode: 3, subCategory: "Noida", createdBy: ADMINID, updatedBy: ADMINID }
        ];

        // Delete existing entries and insert new data
        await LocationCategoryModel.deleteMany({});
        await LocationCategoryModel.insertMany(locationCategory);

        await LocationSubCategoryModel.deleteMany({});
        await LocationSubCategoryModel.insertMany(locationSubCategory);
    } catch (error) {
        return error;
    } finally {
        await mongoose.disconnect();
    }
};

// Export the function for use with runSeeders.js
module.exports = seedLocatinoCategories;

// If the script is run directly, execute the function
if (require.main === module) {
    seedLocatinoCategories();
}