const Schedule = require("../models/schedule.model");
const moment =require("moment")
const mongoose = require("mongoose");
//create schedules need io here
//mob
exports.getMobileSchgedule=async(req,res,next)=>{
  try{
    let filter={}
    let departure_date
    let today =moment(now).dayOfYear();
    const {source,destination,departureDate,organization}=req.query
    if(!source||!destination)
    {
      return res.json({message:"please fill both source and destination field"})
    }
    organization?filter.organizationCode=organization:filter=filter
    source?filter.source=source:filter=filter
    destination?filter.destination=destination:filter=filter
    departureDate?departure_date=departureDate:departure_date=today+1
    const now =new Date()
    const schedule=await Schedule.aggregate([
      {$match:{...filter,$expr: { $eq: [ {$dayOfYear:"$departureDateAndTime"},] },$expr: { $lt: [ {$size:"$occupiedSitNo"},"$totalNoOfSit" ] }}},
      {
        $lookup:{
          from:'organizations',
          foreignField:"organizationCode",
          localField:"organizationCode",
          as:"organization"
        }
        },
        {$project:{"organizationName":"$organization.organizationName","source":1,"destination":1,"departureDateAndTime":1,"distance":1,"estimatedHour":1,"tarif":1,"sitLeft":{$subtract:["$totalNoOfSit",{$size:"$occupiedSitNo"}]}}}
    ])
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}

//update passanger info
exports.updateMobilePassinfo = async (req, res, next) => {
  try {
   const schedule_id=req.params.id
   const ticket_id= req.body.ticketId;
   const passangerName=req.body.passangerName;
   const passangerPhone=req.body.phoneNumber;
   await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].passangerName":passangerName,"passangerInfo.$[el].passangerPhone":passangerPhone}},
     {arrayFilters:[{"el.uniqueId":ticket_id}],new:true,useFindAndModify:false})
      return res.json("done")
  }
  catch(error) {
    next(error)
  }
};

exports.getTicketHistory=async(req,res,next)=>{
  try{
    const user_id=req.user.sub
    const schedule=await Schedule.aggregate([
{
    $unwind:"$passangerInfo"
},
{
  $lookup:{
    from:'organizations',
    foreignField:"organizationCode",
    localField:"organizationCode",
    as:"organization"
  }
  },
  {
    $lookup:{
      from:'buses',
      foreignField:"_id",
      localField:"assignedBus",
      as:"bus"
    }
    },
{
  $match:{"$passangerInfo.bookedBy":user_id}
},
{
  $project:{"_id":0,"busNo":{$arrayElemAt:["$bus.busPlateNo",0]},"organizationName":{$arrayElemAt:["$organization.organizationName",0]},"passangerName":"$passangerInfo.passangerName","passangerPhone":"$passangerInfo.passangerPhone","ticketId":"$passangerInfo.uniqueId","bookedAt":"$passangerInfo.bookedAt","passangerSit":"$passangerInfo.passangerOccupiedSitNo","source":1,"destination":1,"departureDateAndTime":1,"distance":1,"estimatedHour":1,"tarif":1,}
}
])
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
//cancel sit
exports.cancelTicket = async (req, res, next) => {
  try {
    const schedule_id=req.params.id
    const pass_id=req.body.uniqueId
    const pass_sit=req.body.passangerSit
    const timenow = new Date
    const schedule=await Schedule.findById(schedule_id)
    if(moment(schedule.departureDateAndTime).isAfter(timenow))
    { 
      await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].sitCanceled":pass_sit},$pull:{occupiedSitNo: pass_sit }},
      {arrayFilters:[{"el.uniqueId":pass_id}],new:true,useFindAndModify:false})
      return res.json({meaage:"sit canceled. please contact bus ticket office for your refund"})
    }
    return res.json({meaage:"departure time passed. please contact bus ticket office"})
  }
  catch(error) {
    next(error)
  }
}
//driver get my pass
exports.getMyPassanger=async(req,res,next)=>{
  try{
    console.log("driver")
    const driver_id=mongoose.Types.ObjectId(req.params.id)
    const now =new Date()
    const schedule=await Schedule.aggregate([
{
    $project:{"after3":{
      $dateAdd: {
        startDate:"$departureDateAndTime",
        unit:"hour",
        amount:24,
     }
    },
   "before8":{
    $dateSubtract: {
      startDate:"$departureDateAndTime",
      unit:"hour",
      amount:24,
    }
   },"passangerInfo":1,"source":1,"assignedBus":1,"destination":1,"departureDateAndTime":1,"distance":1,"estimatedHour":1,"tarif":1,"organizationCode":1}
},
{
  $match:{"before8":{$lte:now},"after3":{$gte:now}}
},
{
    $unwind:"$passangerInfo"
},
{
  $lookup:{
    from:'organizations',
    foreignField:"organizationCode",
    localField:"organizationCode",
    as:"organization"
  }
  },
  {
    $lookup:{
      from:'buses',
      foreignField:"_id",
      localField:"assignedBus",
      as:"bus"
    }
  },
{
  $match:{"bus.driverId":driver_id}
},
{
  $project:{"_id":0,"busPlateNo":{$arrayElemAt:["$bus.busPlateNo",0]},"organizationName":{$arrayElemAt:["$organization.organizationName",0]},"passangerName":"$passangerInfo.passangerName","passangerPhone":"$passangerInfo.passangerPhone","ticketId":"$passangerInfo.uniqueId","bookedAt":"$passangerInfo.bookedAt","passangerSit":"$passangerInfo.passangerOccupiedSitNo","source":1,"destination":1,"departureDateAndTime":1,"distance":1,"estimatedHour":1,"tarif":1}
},

])
console.log(schedule)
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
