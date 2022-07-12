const City = require("../models/city.model");

exports.registerCity = async (req, res, next) => {
  try {
    const cityname = req.body.cityName;
    const departureplace= req.body.departurePlace;
    const orgcode =req.userinfo.organization_code;

    const newbus= new City({
      cityName:cityname,
      departurePlace:departureplace,
      organizationCode:orgcode,
    })
    const savedbus=await newbus.save()
    return res.json(savedbus)
  }
catch(error) {
next({message:"city already exist"});
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
  const orgcode =req.userinfo.organization_code;
  const allcity= await City.find({organizationCode:orgcode},{departurePlace:1})
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
   const city_name = req.body.cityName;
   const departure_place= req.body.departurePlace;
   const org_code =req.userinfo.organization_code;
   const bus= await City.findByIdAndUpdate(id,{
     $set:{
      cityName:city_name,
      departurePlace:departure_place,
      organizationCode:org_code,
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
