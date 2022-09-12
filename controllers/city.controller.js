const City = require("../models/city.model");
const Load= require('lodash');
exports.registerCity = async (req, res, next) => {
  try {
    const cityname = Load.capitalize(req.body.cityName);
    const departureplace= req.body.departurePlace.map(e=>Load.capitalize(e));
    const orgcode =req.userinfo.organization_code;

    const newbus= new City({
      cityName:cityname,
      departurePlace:departureplace,
      organizationCode:orgcode,
    })
    const isCityExist=await City.findOne({cityName:cityname})
    if(isCityExist)
    {
  const error = new Error("This city already exist, try another one")
  error.statusCode = 400
  throw error;
    }
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
  const allcity= await City.find({organizationCode:orgcode})
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
  req.query.source?query={cityName:req.query.source}:query=query
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
   const city_name = Load.startCase(req.body.cityName);
   const departure_place= req.body.departurePlace.map(e=>Load.startCase(e));
   const bus= await City.findByIdAndUpdate(id,{
     $set:{
      cityName:city_name,
      departurePlace:departure_place,
     }
   })
   res.json(bus)
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
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};
