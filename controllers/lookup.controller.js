const Lookup = require("../models/lookup.model");
exports.addLookup= async (req, res, next) => {
  try {
    const lookup= await Lookup.find()
if(lookup){
  const error = new Error("only one lookup supported, please update existing one." )
  error.statusCode = 400
  throw error;
}
    const newLookup= new Lookup({
      ...req.body,
    })
    const savedLookup=await newLookup.save()

    return res.json(savedLookup)
  }
catch(error) {
next(error)
  }
};
//get all account in organization
exports.getLookup = async (req, res, next) => {
  try {
  const lookup= await Lookup.find()
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
    const id =req.params.id
   const payment= await Lookup.findByIdAndUpdate(id,{
     $addToSet:{offer:offer},
     $addToSet:{banks:bank},
   },{new:true})
   res.json(payment)
  }
  catch(error) {
    next(error)
  }
};

