const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const LocationSchema = new mongoose.Schema({
location:{type:String},
date:{type:Date},
assigneDate:{type:Date},
busId: {
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'bus', 
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

const Location = mongoose.model("location", LocationSchema);

module.exports = Location;