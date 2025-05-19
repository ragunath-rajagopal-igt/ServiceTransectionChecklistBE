const mongoose = require("mongoose");

const constructuralSchema = mongoose.Schema({
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
  eta:{
    type: String,
  },
  documentReference:{
    type: String,
  },
  siteName:{
    type: String,
  },
  userName:{
    type: String
  },
  note:{
    type: String,
  },
  module:{
    type: String,
  },
  download: {
    type:String,
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

constructuralSchema.index({  createdBy: 1, createdAt: -1 });

module.exports = mongoose.model("constructural", constructuralSchema);
