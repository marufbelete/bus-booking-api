const Lookup = require("../models/lookup.model");
exports.addLookup= async (req, res, next) => {
  try {
    const lookup= await Lookup.findOne()
    console.log(lookup)
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
    const {offer,banks}=req.body
    const id =req.params.id
    console.log(req.body)
    let update_option={}
    offer?update_option.offer=offer:update_option
    banks?update_option.banks=banks:update_option
    console.log(update_option)
   const look= await Lookup.findByIdAndUpdate(id,{
     $addToSet:{...update_option},
   },{new:true,useFindAndModify:false})
   return res.json(look)
  }
  catch(error) {
    next(error)
  }
};

