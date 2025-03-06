const mongoose = require("mongoose");

const authSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "user"
    },
    role: {
      code: {
        type: String,
        required: [true, "Please add the role code"],
      },
      name: {
        type: String,
        required: [true, "Please add the role name"],
      },
    },
    organization: [{
      code: {
        type: String,
        required: [true, "Please add the organization code"],
      },
      name: {
        type: String,
        required: [true, "Please add the organization name"],
      },
    }],
    username: {
      type: String,
      required: [false, "Please add the user name"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [50, "Username cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
      trim: true,
      match: [
        /^\S+@\S+\.\S+$/,
        "Please add a valid email address",
      ],
    },
    password: {
      type: String,
      required: [false, "Please add the user password"],
    },
    isAdmin: {
      type: Boolean,
      required: [true],
      default: 0,
    },
    isEmailVerified: {
      type: Boolean,
      required: [true],
      default: false,
    },
    forceLogin: {
      type: Boolean,
      required: [true],
      default: false,
    },
    isArchive: {
      type: Boolean,
      required: [true],
      default: 0,
    },
    status: {
      type: String,
      required: [true, "Please add status"],
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    createdBy: {
      type: String,
      ref: "auth",
    },
    updatedBy: {
      type: String,
      ref: "auth",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("auth", authSchema);