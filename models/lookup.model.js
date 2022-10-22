const mongoose = require("mongoose");
const LookupSchema = new mongoose.Schema({
offer: [String],
banks:[String],
createdBy:{
  type: mongoose.Schema.Types.ObjectId, ref: 'user', 
  required: true,
},

  
},
  {
    timestamps: true,
  },
);

const Lookup = mongoose.model("lookup", LookupSchema)
module.exports = Lookup;