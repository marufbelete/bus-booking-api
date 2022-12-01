const Cashagenttransaction=require("../models/agentcashtransaction.model")

exports.getAgentCashTransaction = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
   const cashTransaction= await Cashagenttransaction.find({organizationCode:orgcode}).
   populate('agent', 'agentName phoneNumber').
   populate('collectedBy','firstName lastName phoneNumber')
   console.log(cashTransaction)
   const mapedInfo=cashTransaction?.map(e=>({
    _id:e._id,
    agentName:e?.agent?.agentName,
    phoneNumber:e?.agent?.phoneNumber,
    amount:e?.amount,
    collectedBy:e?.collectedBy&&`${e?.collectedBy?.firstName} 
    ${e?.collectedBy?.lastName}`,
    collectorPhone:e?.collectedBy?.phoneNumber,
    updatedAt:e?.updatedAt,
  }))
   return res.json(mapedInfo)
  }
catch(error) {
  console.log(error)
next(error)
  }
};

