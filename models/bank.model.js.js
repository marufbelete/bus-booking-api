const mongoose = require("mongoose");
const BankSchema = new mongoose.Schema({
description: {
    type: String,
},
bankName:{
  type: String,
},
accountNumber:{
  type: String,
  required:true
},
type:{
  type: String,
},
remark:{
  type: String,
},
createdBy:{
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'user', 
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

const Bank = mongoose.model("bank", BankSchema);

module.exports = Bank;