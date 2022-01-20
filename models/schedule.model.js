const mongoose = require("mongoose");

const RouteSchema = new mongoose.Schema({
route:{

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
}
},
bus:{  
     
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
totalNoOfSit: {
    type: number,
    trim: true,
    required: true,
}
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
    required: true,
  },
numberOfBookedSit:{
    type: Number,
    default:0,
    trim: true,
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

const Route = mongoose.model("route", RouteSchema);

module.exports = Route;