const mongoose = require("mongoose");

const adminSeveritySchema = mongoose.Schema({
  label:{
    type: String
  },
  severity:{
    type: String,
  },
  active:{
    type: String,
  },
  createdBy: {
    type: String,
  },
  updatedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  updatedAt: {
    type: Date,
  },
 
});

adminSeveritySchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminSeverity", adminSeveritySchema);
