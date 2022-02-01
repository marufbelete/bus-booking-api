const mongoose = require("mongoose");

const HotelAndPensionSchema = new mongoose.Schema({

cityName: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
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
},
hotelMapLocation:{
    type: String,
    trim: true,
},

PensionName:{
    type: String,
    trim: true,

},
pensionDescription:{
    type: String,
    trim: true,
},
pensionContact:{
    type: String,
    trim: true,
},
pensionMapLocation:{
    type: String,
    trim: true,
},

},
  {
    timestamps: true,
  },
);

const HotelAndPension = mongoose.model("hotelandpension", HotelAndPensionSchema);

module.exports = HotelAndPension;