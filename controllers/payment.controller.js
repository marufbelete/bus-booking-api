const Payment = require("../models/paymentmethod.model");
exports.addPayment= async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
    const sub=req.userinfo.sub
    const newPaymentmethod= new Payment({
      ...req.body,
      organizationCode:orgcode,
      createdBy:sub
    })
    const savedpayment=await newPaymentmethod.save()
    return res.json(savedpayment)
  }
catch(error) {
next(error)
  }
};
//get all account in organization
exports.getAllOrganizationPayment = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const payment= await Payment.find({organizationCode:orgcode})
  return res.json(payment)
  }
  catch(error) {
    next(error)
  }
};

//get organization by id
exports.updatePaymentInfo = async (req, res, next) => {
  try {
    const sub=req.userinfo.sub
    const id=req.params.id
   const payment= await Payment.findByIdAndUpdate(id,{
     $set:{
      ...req.body,
      lastupdatedBy:sub
     }
   },{new:true})
   res.json(payment)
  }
  catch(error) {
    next(error)
  }
};

