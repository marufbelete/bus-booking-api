const Bus = require("../models/bus.model");
const Location=require('../models/Date_Location.model')
const User = require("../models/user.model");
const Route = require("../models/route.model");
const mongoose = require("mongoose");
const moment=require('moment')
exports.registerBus = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()  
  try {
    const busplateno = req.body.busplateno;
    const bussideno= req.body.bussideno;
    const redat_id =req.body.redatid;
    const driver_id =req.body.driverid;
    const service_year=req.body.serviceyear;
    const totalsit =req.body.totalsit;
    const createdby =req.userinfo.sub;
    const orgcode =req.userinfo.organization_code;
    const now=new Date()
    //subtract some number to make it like perv
    const before_5=moment(now).subtract(5,'d')
    const before_4=moment(now).subtract(4,'d')

if(!!busplateno && !!bussideno && !!driver_id && !!totalsit)
{ 
    const newbus= new Bus({
      busPlateNo:busplateno ,
      busSideNo:bussideno,
      driverId:driver_id,
      redatId:redat_id,
      serviceYear:service_year,
      totalNoOfSit:totalsit,
      createdBy:createdby,
      organizationCode:orgcode,
    })
    const savedbus=await newbus.save({session})
    const location=new Location({        
      busId:savedbus._id,
      date:before_4,
      assigneDate:before_5,
      organizationCode:orgcode})
    await location.save({session})
    await User.findByIdAndUpdate(driver_id,{
      $set:{
       isAssigned:process.env.ASSIGNEDUSER
      }
    },{session})
    await User.findByIdAndUpdate(redat_id,{
      $set:{
       isAssigned:process.env.ASSIGNEDUSER
      }
    },{session})
    session.commitTransaction()
    return res.json(savedbus)
  }
  const error = new Error("please fill all field")
  error.statusCode = 400
  throw error;
  }
catch(error) {
await session.abortTransaction();
next(error);
  }
};
//get all organizaton bus organization
exports.getAllOrganizationBus = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const allbus= await Bus.find({organizationCode:orgcode})
  res.json(allbus)
  }
  catch(error) {
    next(error)
  }
};
exports.getBusById = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const {id}=req.params
  const singlebus= await Bus.findOne({_id:id,organizationCode:orgcode})
  res.json(singlebus)
  }
  catch(error) {
    next(error)
  }
};

//get bus detail
exports.getDetailOrganizationBus = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  // console.log(orgcode)
  const allbus= await Bus.aggregate([{
      $match:{organizationCode:orgcode}
  },
  {
    $lookup:{
      from:'users',
      foreignField:"_id",
      localField:"driverId",
      as:"driver"
    }
  },
  {
    $lookup:{
      from:'users',
      foreignField:"_id",
      localField:"redatId",
      as:"redat"
    }
  },
  {
    $project:{"_id":1,"busState":1,"busPlateNo":1,"busSideNo":1,"serviceYear":1,"totalNoOfSit":1,"driverId":1,"redatId":1,"drverPhone":{$arrayElemAt:["$driver.phoneNumber",0]},"redatPhone":{$arrayElemAt:["$redat.phoneNumber",0]},}
  },
])
  return res.json(allbus)
  }
  catch(error) {
    next(error)
  }
};

//get bus by route
exports.getAllOrganizationBusByState = async (req, res, next) => {
  try {
  const state=req.query.state
  const orgcode =req.userinfo.organization_code;
  const allbus= await Bus.find({organizationCode:orgcode,busState:state})
  return res.json(allbus)
  }
  catch(error) {
    console.log(error)
    next(error)
  }
};
//get active bus imited info
exports.getOrganizationActiveBus = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const allbus= await Bus.find({organizationCode:orgcode,busState:"Active"},
  {busPlateNo:1,busSideNo:1 })
  return res.json(allbus)
  }
  catch(error) {
    next(error)
  }
};
//get free bus for given Date
// //remove this when clean up
// exports.getOrganizationFreeBus = async (req, res, next) => {
//   try {
//     console.log(req.query)
//   const orgcode =req.userinfo.organization_code;
//   const today=new Date()
//   const departure_date=new Date(req.query?.departureDate)?.getDate()||today.getDate()+1
//   const free_bus=await Location.aggregate([
//     {
//       $match:{organizationCode:orgcode}
//     },
//     {
//       $lookup:{
//         from:'buses',
//         foreignField:"_id",
//         localField:"busId",
//         as:"bus"
//       }
//       },
//       {$project:{location:1,assigneDate:1,day:{$dayOfMonth:"$assigneDate"},date:1,
//       busPlateNo:{$arrayElemAt:["$bus.busPlateNo",0]},
//       busSideNo:{$arrayElemAt:["$bus.busSideNo",0]},
//       redatId:{$arrayElemAt:["$bus.redatId",0]},
//       driverId:{$arrayElemAt:["$bus.driverId",0]},
//       serviceYear:{$arrayElemAt:["$bus.serviceYear",0]}}},
//       {
//        $match:{day:{$ne:departure_date}}
//       } ,
//       {
//         $project:{day:0}
//       }
//     ])

//      return res.json(free_bus)
//   }
//   catch(error) {
//     next(error)
//   }
// };
//in given route
//get free bus for given Date
exports.getOrganizationFreeBusInRoute = async (req, res, next) => {
  try {
  const {source,destination,departureDate,currentBusId}=req.query
  console.log("free")
  // console.log(req.query)
  const orgcode =req.userinfo.organization_code;
  const final_result=[]
  const today=new Date()
  if(!source||!destination)
  {
    const error = new Error("source and destination field are required")
    error.statusCode = 400
    throw error;
  }
  const atDate=new Date(departureDate)
  //take given date or tomorrow as default
  const departure_date=atDate?.getDate()||today.getDate()+1
  const departure_month=atDate?.getMonth()+1||today.getMonth()+1
  const departure_year=atDate?.getFullYear()||today.getFullYear()
  //get all bus in route
  const bus_in_route=await Route.findOne({source,destination},{bus:1})
  //if there are no bus in route return empty array
  if(bus_in_route?.bus?.length<1)
  {
    return res.json([])
  }
  //if there are get those not free for the given date in given route
  const not_free_bus=await Location.aggregate([
    {
      $match:{organizationCode:orgcode,busId:{$in:bus_in_route?.bus}}
    },
    {
      $lookup:{
        from:'buses',
        foreignField:"_id",
        localField:"busId",
        as:"bus"
      }
      },
      {
      $project:{busId:1,day:{$dayOfMonth:"$assigneDate"},
      month:{$month:"$assigneDate"},year:{$year:"$assigneDate"}}
      },
      {
       $match:{day:departure_date,month:departure_month,year:departure_year}
      },
      {
        $project:{busId:1}
      }
    ])
    const not_freeBus_ids=not_free_bus?.map(e=>String(e.busId))
    const free_bus_id=bus_in_route?.bus?.filter(e=>!not_freeBus_ids.includes(String(e)))
    if(currentBusId!="null"){
      free_bus_id.push(currentBusId)}
for(let bus_id of free_bus_id)
{
  //choose the nearest tracked location for those free bus
  const push_bus=await Location.aggregate([
    {
      $match:{organizationCode:orgcode,busId:bus_id}
    },
    {
      $lookup:{
        from:'buses',
        foreignField:"_id",
        localField:"busId",
        as:"bus"
        }
    },
      {
      $project:{location:1,busId:1,assigneDate:1,
      day:{$dayOfMonth:"$assigneDate"},date:1,
      month:{$month:"$assigneDate"},
      year:{$year:"$assigneDate"},
      busPlateNo:{$arrayElemAt:["$bus.busPlateNo",0]},
      busSideNo:{$arrayElemAt:["$bus.busSideNo",0]},
      redatId:{$arrayElemAt:["$bus.redatId",0]},
      driverId:{$arrayElemAt:["$bus.driverId",0]},
      serviceYear:{$arrayElemAt:["$bus.serviceYear",0]}}},
      {$sort:{year:-1,month:-1,day:-1}},
      {$limit:1},
    ])
    final_result.push(...push_bus)
}
     return res.json(final_result)
  }
  catch(error) {
    console.log(error)
    next(error)
  }
};

//get organization by id
exports.updateBusInfo = async (req, res, next) => {
  const session=await mongoose.startSession()
  try {
   const updated={createdBy:req.userinfo.sub}
   const id=req.params.id
   req.body.busState?updated.busState=req.body.busState:updated
   req.body.totalNoOfSit?updated.totalNoOfSit=req.body.totalNoOfSit:updated
   req.body.driverId?updated.driverId=req.body.driverId:updated
   req.body.redatId?updated.redatId=req.body.redatId:updated
   req.body.plateNo?updated.busPlateNo=req.body.plateNo:updated
   req.body.sideNo?updated.busSideNo=req.body.sideNo:updated
   req.body.serviceYear?updated.serviceYear=req.body.serviceYear:updated
   session.startTransaction()  
   const bus_user= await Bus.findById(id)
   if(bus_user.driverId!=req.body.driverId)
   {
    await User.findByIdAndUpdate(bus_user.driverId,{
      $set:{
       isAssigned:process.env.UNASSIGNEDUSER
      }
    },{session})
   }
   if(bus_user.redatId!=req.body.redatId)
   {
    await User.findByIdAndUpdate(bus_user.redatId,{
      $set:{
       isAssigned:process.env.UNASSIGNEDUSER
      }
    },{session})
   }
   const bus= await Bus.findByIdAndUpdate(id,{
     $set:{
   ...updated
     }
   },{new:true})
   await User.findByIdAndUpdate(req.body.driverId,{
     $set:{
      isAssigned:process.env.ASSIGNEDUSER
     }
   },{session})
   await User.findByIdAndUpdate(req.body.redatId,{
     $set:{
      isAssigned:process.env.ASSIGNEDUSER
     }
   },{session})
   session.commitTransaction()
   return res.json(bus)
  }
  catch(error) {
    await session.abortTransaction()
    next(error)
  }
};
//change bus status
exports.updateBusStatus = async (req, res, next) => {
  try {
   const id=req.params.id
   const bus_status = req.body.busstatus;
   const bus= await Bus.findByIdAndUpdate(id,{
     $set:{
      busState:bus_status
     }
   },{new:true})

   return res.json(bus)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteBus = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Bus.findByIdAndDelete(deleteid)
   return res.json({message:"deleted successfully",status:true})
  }
  catch(error) {
    next(error)
  }
};
