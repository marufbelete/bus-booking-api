const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name:{
    type: String,
    trim: true,
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
  isMobileUser:{
    type:Boolean,
    required: true,
  },
  userRole:{
    type: String,
    enum: ['firstadmin','admin','casher','driver','agent'],
    trim: true,
    toLowerCase:true,
  },
  //only for organization user
  organizationCode:{
    type: String,
    trim: true,
  }
},
  {
    timestamps: true,
  },
);

  // {_requester: 1, _requestedBook: 1, status: 1},
  // {unique: true, partialFilterExpression: { "status" : "opened" }}
// usersSchema.index({name: 1 });
// usersSchema.index({email: 1 });

const User = mongoose.model("user", UserSchema);

module.exports = User;