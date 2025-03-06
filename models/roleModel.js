const mongoose = require("mongoose");

const roleSchema = mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please add the role code"],
      unique: [true, "Code already taken"],
    },
    name: {
      type: String,
      required: [true, "Please add the role name"],
    },
    isArchive: {
      type: Boolean,
      required: [true],
      default: 0,
    },
    createdBy: {
        type: String,
        required: [true],        
    },
    updatedBy: {
        type: String,
        required: [true],        
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("role", roleSchema);