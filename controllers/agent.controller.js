const Agent = require("../models/agent.model");
exports.registerAgent = async (req, res, next) => {
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
    return res.json(savedagent)
  }
catch(error) {
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
  if(tin){update.agentName=tin}
  if(maxUser){update.agentName=maxUser}
  if(location){update.location=location}
  if(isActive){update.agentName=isActive}
   const agent= await Agent.findByIdAndUpdate(id,{
     $set:{
      ...update
     }
   })
   res.json(agent)
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
   res.json({message:"deleted successfully"})
  }
  catch(error) {
    next(error)
  }
};
