const mongoose = require("mongoose");

const moduleRolePermissionSchema = mongoose.Schema(
  {
    roleCode: {
      type: String,
      required: [true, "Please add the module code"],
      unique: [true, "Code already taken"],
    },
    moduleCode: {
      type: [String],
      required: [true, "Please add the module permission"],
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

module.exports = mongoose.model("moduleRolePermission", moduleRolePermissionSchema);