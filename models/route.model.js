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
distance: {
  type: Number,
  trim: true,
}, 
estimatedHour: {
    type: String,
    trim: true,
},
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

const Route = mongoose.model("route", RouteSchema);

module.exports = Route;