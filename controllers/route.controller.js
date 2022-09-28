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
exports.getOrganizationRouteById = async (req, res, next) => {
  try {
  const id=req.query.id
  const orgcode =req.userinfo.organization_code;
  const allroute= await Route.find({organizationCode:orgcode,_id:id})
  return res.json(allroute)
  }
  catch(error) {
    next(error)
  }
};
exports.getOrganizationDetailRoute = async (req, res, next) => {
  try {
  
  const orgcode =req.userinfo.organization_code;
  const allroute= await Route.aggregate([
    {$match:{organizationCode:orgcode}},
    {
      $lookup:{
        from:'buses',
        foreignField:"_id",
        localField:"bus",
        as:"busName"
      }},
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
//bus in given route
exports.getOrganizationBusByRoute = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const filter={}
  const {source,destination}=req.query
  if(source){filter.source=source}
  if(destination){filter.destination=destination}
  // {busPlateNo:1,busSideNo:1 }
  const allbus= await Route.aggregate([
    {
      $match:{organizationCode:orgcode,...filter},
    },
    {$unwind:'$bus'},
    {
      $lookup:{
        from:'buses',
        foreignField:"_id",
        localField:"bus",
        as:"busName"
      }
    },
    {
      $project:{Bus:'$busName'}
    }
  ])
  return res.json(allbus)
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
