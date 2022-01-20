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
  userType:{
    type: String,
    enum: ['10','20'],
    trim: true,
    required: true,
  },
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