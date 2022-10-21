const mongoose = require("mongoose");
const LookupSchema = new mongoose.Schema({
offer: {
  wifi:{
    type: String,
  },
  breakfast:{
    type: String,
  },
  },
  banks:[{
    bankName:{
      type: String,
    },
  }],
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

const Lookup = mongoose.model("lookup", LookupSchema)
module.exports = Lookup;