const Cashlocaltransaction=require("../models/localcashtransaction.model")
exports.getCashTransaction = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
   const cashTransaction= await Cashlocaltransaction.find({organizationCode:orgcode}).
   populate('user', 'firstName lastName phoneNumber branch').
   populate('collectedBy','firstName lastName phoneNumber')
   console.log(cashTransaction)
   const mapedInfo=cashTransaction?.map(e=>({
    _id:e._id,
    fullName:`${e?.user?.firstName} ${e?.user?.lastName}`,
    phoneNumber:e?.user?.phoneNumber,
    amount:e?.amount,
    branch:e?.user?.branch,
    isCollected:e?.isCollected,
    collectedBy:e?.collectedBy&&`${e?.collectedBy?.firstName} 
    ${e?.collectedBy?.lastName}`,
    collectorPhone:e?.collectedBy?.phoneNumber,
    updatedAt:e?.updatedAt,
  }))
  // console.log(mapedInfo)
   return res.json(mapedInfo)
  }
catch(error) {
  console.log(error)
next(error)
  }
};
