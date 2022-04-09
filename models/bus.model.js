const mongoose = require("mongoose");

const BusSchema = new mongoose.Schema({
busPlateNo: {
    type: String,
    trim: true,
    required: true,
  },
busSideNo: {
    type: String,
    trim: true,
    required: true,
},
redatId: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user', 
},
driverId: {
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'user', 
},
serviceYear: {
  type:Number, 
  trim: true,
  required: true,
},
totalNoOfSit: {
    type: Number,
    trim: true,
    required: true,
},
createdBy:{
  type: mongoose.Schema.Types.ObjectId, ref: 'user', 
  required: true,
},
busState:{
  type:String,
  enum:["Active","Inactive","On-Repair","Damaged"],
  default: true,
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

const Bus = mongoose.model("bus", BusSchema);

module.exports = Bus;