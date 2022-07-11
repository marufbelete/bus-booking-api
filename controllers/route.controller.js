const Route = require("../models/route.model");

exports.addRoute = async (req, res, next) => {
  try {
    const source = req.body.source;
    const destination = req.body.destination;
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
    const savedroute=await newroute.save()
    return res.json(savedroute)
  }
catch(error) {
console.log(error)
next(error);
  }
};
//get route
exports.getOrganizationRoute = async (req, res, next) => {
  try {
  
  // const orgcode =req.userinfo.organization_code;
  const allroute= await Route.find({organizationCode:"001000"})
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
   const source = req.body.source;
   const destination = req.body.destination;
   const tarif= req.body.tarif;
   const distance = req.body.distance;
   const estimated_hour = req.body.estimatedHour;
   const max_trip=req.body.maxtrip//array of bus
   const dep_plcae=req.body.departureplace
   const createdby =req.userinfo.sub;

   const bus= await Route.findByIdAndUpdate(id,{
     $set:{
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      maximumTrip:max_trip,
      createdBy:createdby,
      departurePlace:dep_plcae,
      createdBy:createdby,
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
