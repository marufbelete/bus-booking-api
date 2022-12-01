const Agent = require("../models/agent.model");
const Manageagentcash=require("../models/manageagentcash.model")
const mongoose = require("mongoose");

exports.registerAgent = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()
  try {
    const {agentName,phoneNumber,tin,maxUser,location,isActive}=req.body;
    const orgcode =req.userinfo.organization_code;
    const newagent= new Agent({
        agentName,
        phoneNumber,
        tin,
        maxUser,
        location,
        isActive,
        organizationCode:orgcode,
    })
    const isCityExist=await Agent.findOne({tin:tin})
    if(isCityExist)
    {
  const error = new Error("Agent with is tin already exist.")
  error.statusCode = 400
  throw error;
    }
    const savedagent=await newagent.save()
    const managecash=new Manageagentcash({
      agent:savedagent._id,
      cashInHand:0,
      organizationCode:orgcode,
    })
    await managecash.save({session})

    await session.commitTransaction()
    return res.json(savedagent)
  }
catch(error) {
await session.abortTransaction()
next(error)
  }
};
//get all city in organization
exports.getAllAgent = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const allagent= await Agent.find({organizationCode:orgcode})
  return res.json(allagent)
  }
  catch(error) {
    next(error)
  }
};
//get agent with no account
exports.getAgentWithNoAccount = async (req, res, next) => {
    try {
    const orgcode =req.userinfo.organization_code;
    const allagent= await Agent.find({organizationCode:orgcode,isAcountExist:false})
    return res.json(allagent)
    }
    catch(error) {
      next(error)
    }
  };

//get organization by id
exports.updateAgentInfo = async (req, res, next) => {
  try {
   const id=req.params.id
   const {agentName,phoneNumber,tin,maxUser,location,isActive}=req.body;
   const update={}
  if(agentName){update.agentName=agentName}
  if(phoneNumber){update.phoneNumber=phoneNumber}
  if(tin){update.tin=tin}
  if(maxUser){update.maxUser=maxUser}
  if(location){update.location=location}
  if(isActive){update.isActive=isActive}
   const agent= await Agent.findByIdAndUpdate(id,{
     $set:{
      ...update
     }
   })
   return res.json(agent)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteAgent = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Agent.findByIdAndDelete(deleteid)
   return res.json({message:"deleted successfully"})
  }
  catch(error) {
    next(error)
  }
};
