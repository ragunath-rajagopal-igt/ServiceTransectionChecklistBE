const mongoose = require("mongoose");

const dataManagementSchema = mongoose.Schema({
  severity:{
    type: String
  },
  subArea:{
    type: String,
  },
  itemActivity:{
    type: String,
  },
  productName:{
    type: String,
  },
  owner:{
    type: String,
  },
  status:{
    type: String,
  },
  siteName:{
    type: String,
  },
  module:{
    type: String,
  },
  download: {
    type:String,
  },
  eta:{
    type: String,
  },
  documentReference:{
    type: String,
  },
  note:{
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

dataManagementSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("dataManagement", dataManagementSchema);
