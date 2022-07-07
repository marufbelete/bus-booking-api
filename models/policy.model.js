const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const PolicySchema = new mongoose.Schema({
title: {
    type: String,
    trim: true,
    required: true,
    },
description: {
    type: String,
    trim: true,
    required: true,
},
createdBy:{
  type: Schema.Types.ObjectId, ref: 'user', 
  required: true,
},
organizationCode:{
    type: String,
    trim: true,
    required: true,
  }
  
},
  {
    timestamps: true,
  },
);

const Policy = mongoose.model("policy", PolicySchema);

module.exports = Policy;