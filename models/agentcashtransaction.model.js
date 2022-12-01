const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const CashagenttransactionSchema = new mongoose.Schema({
agent: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'agent', 
  },
amount: {
  type:Number
},
collectedBy: {
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

const Cashagenttransaction = mongoose.model("agenttransaction", CashagenttransactionSchema);

module.exports = Cashagenttransaction;