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
driverUserName: {
   type:String, 
   trim: true,
   required: true,
},
totalNoOfSit: {
    type: Number,
    trim: true,
    required: true,
},
createdBy:{
  type: Schema.Types.ObjectId, ref: 'user', 
  required: true,
},
isActive:{
  type:Boolean,
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