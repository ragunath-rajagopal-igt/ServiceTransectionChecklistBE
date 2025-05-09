const express = require("express");
const connectDb = require("./config/dbConnection");
const errorHandler = require("./middleware/errorHandler");
const dotenv = require("dotenv").config();
const responseFormatter = require('./middleware/responseFormatter');
const loggerService = require('./utils/loggerService');
const cors = require('cors');

connectDb();
const app = express();

//port
const port = process.env.APP_PORT || 5000;

// Add headers
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
app.use(cors());
app.use(express.json());
app.use(responseFormatter);

//common
//app.use("/api/common", require("./routes/commonRoutes"));

//Contructural
app.use("/api/constructural", require("./routes/constructuralRoutes"));

//Data Management
app.use("/api/data-management", require("./routes/dataManagementRoutes"));

//operations
app.use("/api/operations", require("./routes/operationsRoutes"));

//service Management
app.use("/api/service-management", require("./routes/serviceManagementRoutes"));

//technical
app.use("/api/technical", require("./routes/technicalRoutes"));

//gen Document
app.use("/api/gendoc", require("./routes/genDocRoutes"));


//admin
app.use("/api/admin/severity", require("./routes/severityRoutes"));
app.use("/api/admin/subarea", require("./routes/subAreamRoutes"));
app.use("/api/admin/item", require("./routes/itemRoutes"));
app.use("/api/admin/productname", require("./routes/productNameRoutes"));
app.use("/api/admin/ownername", require("./routes/ownerRoutes"));
app.use("/api/admin/status", require("./routes/statusRoutes"));
app.use("/api/admin/site", require("./routes/siteRoutes"));


//project movement
// app.use("/api/project-movement", require("./routes/projectMovementRoutes"));

//new hire module
// app.use("/api/newhire", require("./routes/newhireRoutes"));

//reactive
// app.use("/api/reactivate", require("./routes/reactivateRoutes"));

//auth
app.use("/api/auth", require("./routes/authRoutes"));

//user
app.use("/api/user", require("./routes/userRoutes"));

//network setup
// app.use("/api/network-setup", require("./routes/networkSetupRoutes"));

// short Trip routes
// app.use("/api/short", require("./routes/shortTripRoutes"));

//inactivate
// app.use("/api/inactivate", require("./routes/inactivateRoutes"));

//generateActivity
// app.use("/api/generate-activity", require("./routes/generateActivityRoutes"));

//Reports Route
// app.use("/api/reports", require("./routes/reportsRoutes"));

//Dashboard
// app.use("/api/dashboard", require("./routes/dashboardRoutes"));

// app.use("/api/account-setting", require("./routes/accountSettingRoutes"));


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});