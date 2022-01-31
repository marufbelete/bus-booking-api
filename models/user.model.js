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
  isMobileUser:{
    type:Boolean,
    required: true,
  },
  userRole:{
    type: String,
    enum: ['ownwer','superadmin','admin','casher','driver','agent'],
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
//solve this
UserSchema.index({userRole: 1},{unique: true, partialFilterExpression: { "userRole" : "owner" }});
UserSchema.index({organizationCode: 1},{unique: true, partialFilterExpression: { "userRole" : "superadmin" }});

const User = mongoose.model("user", UserSchema);

module.exports = User;