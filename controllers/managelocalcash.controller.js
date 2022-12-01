const Managecash=require("../models/managelocalcash.model")
const Cashtransaction=require("../models/localcashtransaction.model")
const mongoose = require("mongoose");

exports.getAllManageCash = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
   const cashInfo= await Managecash.find({organizationCode:orgcode}).
   populate('user', 'firstName lastName phoneNumber branch').
   populate('lastUpdatedBy','firstName lastName phoneNumber')
   const mapedInfo=cashInfo?.map(e=>({
    _id:e._id,
    fullName:`${e?.user.firstName} ${e?.user.lastName}`,
    phoneNumber:e?.user.phoneNumber,
    cashInHand:e?.cashInHand,
    branch:e?.user.branch,
    lastUpdatedBy:e?.lastUpdatedBy&&`${e?.lastUpdatedBy?.firstName} 
    ${e?.lastUpdatedBy?.lastName}/${e?.lastUpdatedBy?.phoneNumber}`,
    updatedAt:e?.updatedAt,
    totalRefundedTicket:e?.totalRefundedTicket,
    totalRefundedAmount:e?.totalRefundedAmount
  }))
   return res.json(mapedInfo)
  }
catch(error) {
next(error)
  }
};

exports.giveToCasher = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()
  try {
    const {amount}=req.body
    const orgcode =req.userinfo.organization_code;
    const {id}=req.params
    const updatedBy=req.userinfo.sub
    const cash_m=await Managecash.findOneAndUpdate({_id:id,
      organizationCode:orgcode},
      {$inc:{cashInHand:amount},
       $set:{lastUpdatedBy:updatedBy}},
      {new:true,useFindAndModify:false})
    await Cashtransaction.create([{
      user:cash_m.user,
      collectedBy:updatedBy,
      isCollected:false,
      amount:amount,
      organizationCode:orgcode
    }],{session})
      await session.commitTransaction()
    return res.json({status:true})
  }
catch(error) {
  console.log(error)
await session.abortTransaction()
next(error)
  }
};

exports.receiveFromCasher = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()
  try {
    const {amount}=req.body
    const {id}=req.params
    const updatedBy=req.userinfo.sub
    const orgcode =req.userinfo.organization_code;
    const cash_m = await Managecash.findOneAndUpdate({_id:id,
      organizationCode:orgcode},
      {$inc:{cashInHand:-amount},
       $set:{lastUpdatedBy:updatedBy}},
      {new:true,useFindAndModify:false,session})
      await Cashtransaction.create([{
        user:cash_m.user,
        collectedBy:updatedBy,
        isCollected:true,
        amount:amount,
        organizationCode:orgcode
      }],{session})
      await session.commitTransaction()
      return res.json({status:true})
    }
catch(error) {
  console.log(error)
await session.abortTransaction()
next(error)
  }
};
