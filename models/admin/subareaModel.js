const mongoose = require("mongoose");

const adminSubAreaSchema = mongoose.Schema({
  label:{
    type: String
  },
  subarea:{
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

adminSubAreaSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("adminSubArea", adminSubAreaSchema);
