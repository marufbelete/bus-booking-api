const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const CitySchema = new mongoose.Schema({

cityName: {
    type: String,
    trim: true,
    lowercase:true,
    unique:[true,"city already exist"],
    required: true,
  },
departurePlace: {
    type: [String],
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