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

hotel: [{

hotelName:{
    type: String,
    trim: true,
},
hotelDescription:{
    type: String,
    trim: true,
    required: true,
},
hotelContact:{
    type: String,
    trim: true,
    required: true,
},
hotelMapLocation:{
    type: String,
    trim: true,
    required: true,
},

}],
pension: [{

PensionName:{
    type: String,
    trim: true,
},
pensionDescription:{
    type: String,
    trim: true,
    required: true,
},
pensionContact:{
    type: String,
    trim: true,
    required: true,
},
pensionMapLocation:{
    type: String,
    trim: true,
    required: true,
},
}],

},
  {
    timestamps: true,
  },
);

const City = mongoose.model("city", CitySchema);

module.exports = City;