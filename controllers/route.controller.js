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
    const createdby =req.user.sub;
    const orgcode =req.user.organization_code;
    const newbus= new Route({
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      departurePlace:departure_place,
      maximumTrip:max_trip,
      createdBy:createdby,
      organizationCode:orgcode,
    })
    const savedroute=await newbus.save()
    return res.json(savedroute)
  }
catch(error) {
next(error);
  }
};
//get route
exports.getOrganizationRoute = async (req, res, next) => {
  try {
  const orgcode =req.user.organization_code;
  const allroute= await Route.find({organizationCode:orgcode})
  return res.json(allroute)
  }
  catch(error) {
    next(error)
  }
};
//update route info
exports.updateRouteInfo = async (req, res, next) => {
  try {
   const id=req.params.id
   const source = req.body.source;
   const destination = req.body.destination;
   const tarif= req.body.tarif;
   const distance = req.body.distance;
   const estimated_hour = req.body.estimatedhour;
   const max_trip=req.body.maxtrip
   const dep_plcae=req.body.departureplace
   const createdby =req.user.sub;

   const bus= await Route.findAndUpdateById(id,{
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