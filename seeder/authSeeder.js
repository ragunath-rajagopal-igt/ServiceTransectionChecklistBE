// seeders/admin-seeder.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const AuthModel = require("../models/authModel");
const connectDb = require("../config/dbConnection");
const dotenv = require("dotenv").config();
const ADMINID = process.env.ADMIN_ID;
connectDb();

const seedAuthUser = async () => {
  await connectDb(); // Ensure the database connection is established before running

  try {
    // Check if admin already exists
    const existingAdmin = await AuthModel.findOne({ isAdmin: true });

    if (!existingAdmin) {
      // Create admin credentials
      const adminCredentials = {
        username: "Admin User",
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        role: {
          code: "admin",
          name: "Admin"
        },
        organization: [{
          code: "01",
          name: "Lottery (RI)"
        },{
          code: "1000",
          name: "Gaming (NV)"
        }],
        isAdmin: true,
        createdBy: ADMINID,
        updatedBy: ADMINID,
        // Add other fields as needed
      };

      // Hash the admin password
      const salt = await bcrypt.genSalt(10);
      //Hash password
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
      adminCredentials.password = hashedPassword;

      // Create admin user
      await AuthModel.create(adminCredentials);
    } 
  } catch (error) {
    return error;
  } finally {
    await mongoose.disconnect();
  }
};

// Export the function for use with runSeeders.js
module.exports = seedAuthUser;

// If the script is run directly, execute the function
if (require.main === module) {
  seedAuthUser();
}