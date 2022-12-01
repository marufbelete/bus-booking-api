const Manageagentcash=require("../models/manageagentcash.model")
const Agentcashtransaction=require("../models/agentcashtransaction.model")
const mongoose = require("mongoose");

exports.getAllManageAgentCash = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
   const cashInfo= await Manageagentcash.find({organizationCode:orgcode}).
   populate('agent', 'agentName phoneNumber').
   populate('lastUpdatedBy','firstName lastName phoneNumber')
   console.log(cashInfo)
   const mapedInfo=cashInfo?.map(e=>({
    _id:e._id,
    agentName:e?.agent?.agentName,
    phoneNumber:e?.agent?.phoneNumber,
    cashInHand:e?.cashInHand,
    lastUpdatedBy:e?.lastUpdatedBy&&`${e?.lastUpdatedBy?.firstName} 
    ${e?.lastUpdatedBy?.lastName}/${e?.lastUpdatedBy?.phoneNumber}`,
    updatedAt:e?.updatedAt,
    totalRefundedTicket:e?.totalRefundedTicket,
    totalRefundedAmount:e?.totalRefundedAmount
  }))
  console.log(mapedInfo)
   return res.json(mapedInfo)
  }
catch(error) {
next(error)
  }
};

exports.receiveFromAgent = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()
  try {
    const {amount}=req.body
    const {id}=req.params
    const updatedBy=req.userinfo.sub
    const orgcode =req.userinfo.organization_code;
    const cash_m = await Manageagentcash.findOneAndUpdate({_id:id,
      organizationCode:orgcode},
      {$inc:{cashInHand:-amount},
       $set:{lastUpdatedBy:updatedBy}},
      {new:true,useFindAndModify:false,session})
      await Agentcashtransaction.create([{
        agent:cash_m.agent,
        collectedBy:updatedBy,
        amount:amount,
        organizationCode:orgcode
      }],{session})
      await session.commitTransaction()
      return res.json({status:true})
    }
catch(error) {
await session.abortTransaction()
next(error)
  }
};
