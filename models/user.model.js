const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    trim: true,
    required: true,
  },
phoneNumber:{
    type: String,
    trim: true,
    required: true,
},
  password: {
    type: String,
    trim: true,
    required: true,
  },
  //10 for mobile user and 20 for organization user
  userType:{
    type: String,
    enum: ['10','20'],
    trim: true,
    required: true,
  },
  //only for organization user
  orgCode:{
    type: String,
    trim: true,
  }
},
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", UserSchema);

module.exports = User;