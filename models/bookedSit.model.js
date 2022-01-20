const mongoose = require("mongoose");

const BookedSitSchema = new mongoose.Schema({
passangerInfo:[{
    passangerName: {
        type: String,
        trim: true,
        required: true,
          },
    passangerPhone: {
        type: String,
        trim: true,
        required: true,
        }
    }],
numberOfBookedSit: {
    type: String,
    trim: true,
    required: true,
        },
user:{
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

const BookedSit = mongoose.model("bookedsit", BookedSitSchema);

module.exports = BookedSit;