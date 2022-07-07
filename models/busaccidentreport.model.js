const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
mongoose.plugin(beautifyUnique);
const BusAccidentSchema = new mongoose.Schema({
bus: {
  type: Schema.Types.ObjectId, ref: 'bus', 
  required: true,
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

const BusAccident = mongoose.model("busaccident", BusAccidentSchema);

module.exports = BusAccident;