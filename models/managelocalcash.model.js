const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const ManagelocalcashSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user', 
  },
cashInHand: {
  type:Number
},
totalRefundedTicket: {
  type:Number
},
totalRefundedAmount: {
  type:Number
},
lastUpdatedBy: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user', 
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

const Managelocalcash = mongoose.model("managelocalcash", ManagelocalcashSchema);

module.exports = Managelocalcash;