const Bank = require("../models/bank.model.js");
exports.registerAccount = async (req, res, next) => {
  try {
    const {description,bankName,accountNumber,type,remark}=req.body;
    const orgcode =req.userinfo.organization_code;
    const newAccount= new Bank({
      description,
      bankName,
      accountNumber,
      type,
      remark,
      createdBy,
      organizationCode:orgcode,
    })
    const isAccountNumberexist=await Bank.findOne({accountNumber})
    if(isAccountNumberexist)
    {
  const error = new Error("this account already exist.")
  error.statusCode = 400
  throw error;
    }
    const savedaccount=await newAccount.save()
    return res.json(savedaccount)
  }
catch(error) {
next(error)
  }
};
//get all account in organization
exports.getAllOrganizationAccount = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const account= await Bank.find({organizationCode:orgcode})
  return res.json(account)
  }
  catch(error) {
    next(error)
  }
};

//get organization by id
exports.updateAccountInfo = async (req, res, next) => {
  try {
   const bank= await Bank.findByIdAndUpdate(id,{
     $set:{
      ...req.body
     }
   })
   res.json(bank)
  }
  catch(error) {
    next(error)
  }
};

