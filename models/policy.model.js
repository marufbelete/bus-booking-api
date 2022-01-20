const mongoose = require("mongoose");

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
user:  {
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