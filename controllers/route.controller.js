const Route = require("../models/route.model");
const Load= require('lodash');

exports.addRoute = async (req, res, next) => {
  try {
    const source = Load.capitalize(req.body.source);
    const destination = Load.capitalize(req.body.destination);
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_place=req.body.departureplace;
    const max_trip=req.body.maxtrip
    const createdby =req.userinfo.sub;
    const orgcode =req.userinfo.organization_code;
    const assignedbus=req.body.bus
    console.log(departure_place)
    console.log(assignedbus)
    const newroute= new Route({
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      departurePlace:departure_place,
      maximumTrip:max_trip,
      createdBy:createdby,
      organizationCode:orgcode,
      bus:assignedbus
    })
    const isRouteExist=await Route.findOne({organizationCode:orgcode,source,destination})
    console.log(isRouteExist)
    if(isRouteExist)
    {
  const error = new Error("This Route Already Exist. Please Check The Route List")
  error.statusCode = 400
  throw error;
    }
    const savedroute=await newroute.save()
    return res.json(savedroute)
  }
catch(error) {
console.log(error)
next(error);
  }
};
exports.getOrganizationRoute = async (req, res, next) => {
  try {
  
  const orgcode =req.userinfo.organization_code;
  const allroute= await Route.find({organizationCode:orgcode})
  return res.json(allroute)
  }
  catch(error) {
    next(error)
  }
};
//get route
exports.getOrganizationDetailRoute = async (req, res, next) => {
  try {
  
  const orgcode =req.userinfo.organization_code;
  const allroute= await Route.aggregate([
    {$match:{organizationCode:orgcode}},
    { $unwind: "$bus" },
    {
      $lookup:{
        from:'buses',
        foreignField:"_id",
        localField:"bus",
        as:"buse"
      }},
      { $group: {
        "_id": "$_id","source":{$first:"$source"},"destination":{$first:"$destination"},"tarif":{$first:"$tarif"},"estimatedHour":{$first:"$estimatedHour"},"distance":{$first:"$distance"},"departurePlace":{$first:"$departurePlace"},"bus":{$push:"$buse"}
    }}
      // {$project:{"sorce":1,"destination":1,"tarif":1,"estimatedHour":1,"distance":1,"departurePlace":1,"bus.busPlateNo":1,"bus.busSideNo":1}}
  ])
  return res.json(allroute)
  }
  catch(error) {
    next(error)
  }
};
//update route info
exports.updateRouteInfo = async (req, res, next) => {
  try {
    const assignedbus=req.body.bus
   const id=req.params.id
   const tarif= req.body.tarif;
   const distance = req.body.distance;
   const estimated_hour = req.body.estimatedHour;
   const max_trip=req.body.maxtrip//array of bus
   const dep_plcae=req.body.departureplace;
   const bus= await Route.findByIdAndUpdate(id,{
     $set:{
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      maximumTrip:max_trip,
      departurePlace:dep_plcae,
      bus:assignedbus

     }
   })
   res.json(bus)
  }
  catch(error) {
    next(error)
  }
};
//update bud and depPlace
exports.updateRouteInfoBusAndPlace = async (req, res, next) => {
  try {
   const assignedbus=req.body.bus
   const id=req.params.id
   const dep_plcae=req.body.departureplace;
   const bus= await Route.findByIdAndUpdate(id,{
     $set:{
      departurePlace:dep_plcae,
      bus:assignedbus
     }
   })
   res.json(bus)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteRoute = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Route.findByIdAndDelete(deleteid)
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};
