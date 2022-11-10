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
    console.log(req.body)
   const look= await Lookup.findByIdAndUpdate(id,{
     $addToSet:{offer:offer,banks:bank},
    //  $addToSet:{},
   },{new:true,useFindAndModify:false})
   res.json(look)
  }
  catch(error) {
    next(error)
  }
};

