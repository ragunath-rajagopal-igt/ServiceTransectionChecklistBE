const mongoose = require("mongoose");

const adminProductNameSchema = mongoose.Schema({
  label:{
    type: String
  },
  productName:{
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

adminProductNameSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminProductName", adminProductNameSchema);
