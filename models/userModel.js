const mongoose = require("mongoose");

const locationSchema = mongoose.Schema({
  type: {
    type: String,
    required: [true, "Please add the Location type."],
  },
  subLocation: {
    type: String,
    required: [true, "Please add the Sub-location."],
  }
});

const createUserSchema = mongoose.Schema({
  organizationCode: {
    type: String,
    required: [true, "Organization code is required."],
    trim: true,
  },
  hclSapNo: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  subLocation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'], // You can specify allowed values
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  employeeSubGroup: {
    type: String,
    required: true,
  },
  dojOfHCL: {
    type: Date,
    required: true,
  },
  dojOfIGT: {
    type: Date,
    required: true,
  },
  hclEmail: {
    type: String,
    required: true,
  },
  hclReportingManagerSapNo: {
    type: String,
    required: true,
  },
  igtId: {
    type: String,
    required: false,
    trim: true
  },
  igtUserId: {
    type: String,
    required: false,
    trim: true
  },
  igtEmailId: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address."],
  },
  status: {
    type: String,
    required: [false, "Please add the status."]
  },
  createdBy: {
    type: String,
    required: true
  },
  updatedBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    required: true // Required but can be sent from the client
  },
  updatedAt: {
    type: Date,
    required: true // Required but can be sent from the client
  },
  isArchive : {
    type: Boolean,
    default:false
  },
  isTerminated : {
    type: Boolean,
    default: false
  },
});

createUserSchema.index({ organizationCode: 1, userId: 1, hclSapNo: 1, createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("user", createUserSchema);
