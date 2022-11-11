const mongoose = require("mongoose");
const LookupSchema = new mongoose.Schema({
offer: [{
  title:{
    type:String
  },
  description:{
    type:String
  } 
 }],
banks:[{
  name:{
    type:String
  },
  description:{
    type:String
  } 
 }],
  
},
  {
    timestamps: true,
  },
);

const Lookup = mongoose.model("lookup", LookupSchema)
module.exports = Lookup;