const City = require("../models/city.model");
const Load= require('lodash');
exports.registerCity = async (req, res, next) => {
  try {
    console.log(req.body)
    const cityname = Load.capitalize(req.body.cityName);
    const departureplace= req.body.departurePlace.map(e=>Load.capitalize(e));
    const orgcode =req.userinfo.organization_code;
    const isCityExist=await City.findOne({cityName:cityname})
    if(isCityExist)
    {
  const error = new Error("This city already exist!")
  error.statusCode = 400
  throw error;
    }
    const newbus= new City({
      cityName:cityname,
      departurePlace:departureplace,
      organizationCode:orgcode,
    })
   
    const savedbus=await newbus.save()
    return res.json(savedbus)
  }
catch(error) {
next(error)
  }
};

//get all city in organization
exports.getAllOrganizationCity = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const status=req.query.status
  let filter={organizationCode:orgcode}
  if(typeof activeOnly!=="undefined"){filter.isActive=status}
  const allcity= await City.find(filter)
  return res.json(allcity)
  }
  catch(error) {
    next(error)
  }
};
//get city for mobile
exports.getCity = async (req, res, next) => {
  try {
  const orgcode =req.query.organizationCode;
  const optarr=[{}]
  let option={$or:optarr}
  if(orgcode){
    const orgArr= JSON.parse(orgcode)
    orgArr.forEach(e=>{optarr.push({organizationCode:e,isActive:true})})
  }
  const allcity= await City.aggregate(
    [
      {$match:option},
      {$group:{_id:"$cityName","cityName":{$first:"$cityName"}}},
      {$project:{"_id":0,"cityName":1}}
    ])
  return res.json(allcity)
  }
  catch(error) {
    next(error)
  }
};
//dep.place
exports.getAllDepPlace = async (req, res, next) => {
  try {
  let query={}
  console.log(req.query)
  req.query?.source?query={cityName:req.query.source}:query=query
  const orgcode =req.userinfo.organization_code;
  const allcity= await City.find({organizationCode:orgcode,...query},{departurePlace:1})
  return res.json(allcity)
  }
  catch(error) {
    next(error)
  }
};
//city only
exports.getCityNameOnly = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const allcity= await City.find({organizationCode:orgcode},{cityName:1})
  return res.json(allcity)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id
exports.updateCityInfo = async (req, res, next) => {
  try {
   const id=req.params.id
   const departure_place= req.body?.departurePlace?.map(e=>Load.startCase(e));
   const isActive=req.body.isActive
   let add={}
   let update_opt={}
   if(typeof isActive!== "undefined"){{$set:{update_opt.isActive=isActive}}}
   if(departure_place){add={$addToSet:{departurePlace:departure_place}}}
  const city= await City.findByIdAndUpdate(id,{
     ...update_opt,...add
   },{new:true,useFindAndModify:false})
   return res.json(city)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteCity = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await City.findByIdAndDelete(deleteid)
   return res.json({message:"deleted successfully",status:true})
  }
  catch(error) {
    next(error)
  }
};
