const mongoose = require("mongoose");
const AgentSchema = new mongoose.Schema({
agentName:{
    type: String,
    trim: true,
},
tin:{
  type: String,
  trim: true,
  unique:true
},
maxUser:{
  type: Number,
  default:15,
},
phoneNumber:{
    type: String,
    trim: true,
    required: true,
},
location: {
    type: String,
    trim: true,
    required: true,
  },
isAcountExist:{
    type:Boolean,
    required: true, 
    default:false 
  },
isActive:{
    type:Boolean,
    required: true, 
    default:true 
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,  
    ref: 'user',
  },
  organizationCode:{
    type: String,
    trim: true,
  }
},
  {
    timestamps: true,
  },
);
const Agent = mongoose.model("agent", AgentSchema);
module.exports = Agent;