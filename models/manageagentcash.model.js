const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const ManageagentcashSchema = new mongoose.Schema({
agent: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'agent', 
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

const Manageagentcash = mongoose.model("manageagentcash", ManageagentcashSchema);

module.exports = Manageagentcash;