const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const PaymentSchema = new mongoose.Schema({
description: {
    type: String,
},
type: {
  type: String,
  trim: true,
  required: true,
},
accountId:{
  type: mongoose.Schema.Types.ObjectId, ref: 'bank', 
  required: true,
},
createdBy:{
  type: mongoose.Schema.Types.ObjectId, ref: 'user', 
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

const PaymentMethod = mongoose.model("payment_method", PaymentSchema);

module.exports = PaymentMethod;