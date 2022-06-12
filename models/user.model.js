const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
firstName:{
    type: String,
    trim: true,
},
lastName:{
  type: String,
  trim: true,
},
phoneNumber:{
    type: String,
    trim: true,
    required: true,
    unique: [true,"phone number must be unique"]
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
    enum:{
      values:['owner','superadmin','admin','casher','driver','agent','redat'],
      message: '{VALUE} is not supported'
    } ,
    trim: true,
    toLowerCase:true,
  },
  isActive:{
    type:Boolean,
    required: true, 
    default:true 
  },
  gender:{
    type: String,
    enum: ['male','female'],
    trim: true,
    toLowerCase:true,
  },
  createdBy:this,
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
// this make for one org only one use with superadmin
UserSchema.index({organizationCode: 1,userRole: 1},{unique: true, partialFilterExpression: { "userRole" : "superadmin" }});
const User = mongoose.model("user", UserSchema);

module.exports = User;