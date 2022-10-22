const mongoose = require("mongoose");
const LookupSchema = new mongoose.Schema({
offer: [String],
banks:[String],
  
},
  {
    timestamps: true,
  },
);

const Lookup = mongoose.model("lookup", LookupSchema)
module.exports = Lookup;