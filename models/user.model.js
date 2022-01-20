const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
},
  {
    timestamps: true,
  },
);

const User = mongoose.model("user", UserSchema);

module.exports = User;