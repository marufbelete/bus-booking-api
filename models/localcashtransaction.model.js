const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const CashlocaltransactionSchema = new mongoose.Schema({
user: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user', 
  },
isCollected:{
    type:Boolean
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

const Cashlocaltransaction = mongoose.model("localtransaction", CashlocaltransactionSchema);

module.exports = Cashlocaltransaction;