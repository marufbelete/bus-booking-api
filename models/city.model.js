const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema({

cityName: {
    type: String,
    trim: true,
    required: true,
  },
departurePlace: {
    type: String,
    trim: true,
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

const City = mongoose.model("city", CitySchema);

module.exports = City;