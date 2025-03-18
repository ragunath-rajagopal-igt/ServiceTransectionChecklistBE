const mongoose = require("mongoose");

const adminOwnerSchema = mongoose.Schema({
  label:{
    type: String
  },
  owner:{
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

adminOwnerSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminOwner", adminOwnerSchema);
