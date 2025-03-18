const mongoose = require("mongoose");

const adminItemSchema = mongoose.Schema({
  label:{
    type: String
  },
  itemActivity:{
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

adminItemSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminItem", adminItemSchema);
