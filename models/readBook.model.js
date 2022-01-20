const mongoose = require("mongoose");

const ReadBookSchema = new mongoose.Schema({
title: {
    type: String,
    trim: true,
    required: true,
    },
author: {
    type: String,
    trim: true,
    required: true,
        },
description:  {
    type: String,
    trim: true,
},
buse: [{
    type: Schema.Types.ObjectId, ref: 'bus', 
    required: true,
}],
isFree:{
    type: Boolean,
    trim: true,
    default: true,
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

const ReadBook = mongoose.model("readbook", ReadBookSchema);

module.exports = ReadBook;