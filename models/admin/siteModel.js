const mongoose = require("mongoose");

const adminSiteSchema = mongoose.Schema({
  label:{
    type: String
  },
  site:{
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

adminSiteSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminSite", adminSiteSchema);
