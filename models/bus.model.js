const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const BusSchema = new mongoose.Schema({
busPlateNo: {
    type: String,
    trim: true,
    required: true,
    unique:[true,"Bus Plate Number Already Exist"]
  },
busSideNo: {
    type: String,
    trim: true,
    required: true,
    unique:[true,"Bus Side Number Already Exist"]
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
onDuty:{
  type:Boolean,
  default:false,
},
busState:{
  type:String,
  enum:["Active","Inactive","On-Repair","Damaged"],
  default:"Active",
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