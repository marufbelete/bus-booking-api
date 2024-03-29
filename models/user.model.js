const mongoose = require("mongoose");
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const mongoosePaginate = require('mongoose-paginate-v2');
mongoose.plugin(beautifyUnique);
mongoose.plugin(mongoosePaginate);

const UserSchema = new mongoose.Schema({
firstName:{
    type: String,
    trim: true,

},
lastName:{
  type: String,
  trim: true,
},
agentId:{
  type: mongoose.Schema.Types.ObjectId,  
  ref: 'agent',
},
branch:{
  type:String,
},
isAssigned:{
  type: String,
  enum:{
    values:["0","1","2"],
    message: '{VALUE} is not supported'
  },
  default:"0"
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
      values:['owner','superadmin','admin','casher','driver','superagent','casheragent','redat'],
      message: '{VALUE} is not supported'
    } ,
    trim: true,
    toLowerCase:true,
  },
  isMasterAgent:{
    type:Boolean,
    default: false
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
UserSchema.index({userRole: 1},{unique: true, partialFilterExpression: { "userRole" : "owner" }});
// this make for one org only one use with superadmin
UserSchema.index({organizationCode: 1,userRole: 1},{unique: true, partialFilterExpression: { "userRole" : "superadmin" }});
const User = mongoose.model("user", UserSchema);

module.exports = User;