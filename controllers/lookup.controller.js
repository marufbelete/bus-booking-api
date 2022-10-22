const Lookup = require("../models/lookup.model");
exports.addLookup= async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
    const newLookup= new Lookup({
      ...req.body,
      organizationCode:orgcode
    })
    const savedLookup=await newLookup.save()
    return res.json(savedLookup)
  }
catch(error) {
next(error)
  }
};
//get all account in organization
exports.getAllOrganizationLookup = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const lookup= await Lookup.find({organizationCode:orgcode})
  return res.json(lookup)
  }
  catch(error) {
    next(error)
  }
};

//get organization by id
exports.updateLookupInfo = async (req, res, next) => {
  try {
    const {offer,bank}=req.body
   const payment= await Lookup.findByIdAndUpdate(id,{
     $addToSet:{offer:offer},
     $addToSet:{banks:bank},
   })
   res.json(payment)
  }
  catch(error) {
    next(error)
  }
};

