const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
source: {
    type: String,
    trim: true,
    required: true,
  },
destination: {
    type: String,
    trim: true,
    required: true,
},
tarif: {
    type: String,
    trim: true,
    required: true,
},
departureDate:{
  type: String,
  trim: true,
  required: true,
},
departureTime:{
  type: String,
  trim: true,
  required: true,
},
departurePlace:{
  type: String,
  trim: true,
},
organizationCode:{
  type: String,
  trim: true,
  required: true,
},
totalNoOfSit: {
  type: Number,
  default:49,
  required: true,
},
//changes during ticket creation

passangerInfo:[{
  passangerName: {
      type: Array,
      trim: true,
      required: true,
        },
  passangerPhone: {
      type: String,
      trim: true,
      required: true,
      },
  PassangerOccupiedSitNo:{
    type: Array,
    trim: true,
    required: true,
  },
  bookedBy: {
    type: Schema.Types.ObjectId, ref: 'user', 
    required: true,
    },
  }],
  occupiedSitNo:{
    type: Array,
    trim: true,
  },
//change during assignment
assignedBus:{
  type: Schema.Types.ObjectId, ref: 'bus', 
  required: true,
}


},
  {
    timestamps: true,
  },
);

const Route = mongoose.model("route", RouteSchema);

module.exports = Route;