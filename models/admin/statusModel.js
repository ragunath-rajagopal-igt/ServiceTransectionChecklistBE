const mongoose = require("mongoose");

const adminStatusSchema = mongoose.Schema({
  label:{
    type: String
  },
  status:{
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

adminStatusSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminStatus", adminStatusSchema);
