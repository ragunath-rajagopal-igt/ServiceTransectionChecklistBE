const mongoose = require("mongoose");

const createUserSchema = mongoose.Schema({
 
  username: {
    type: String,
  },
  email:{
    type: String,
  },
  password:{
    type: String,
  },
  sites:[{
    type: String,
  }],
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

createUserSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("user", createUserSchema);
