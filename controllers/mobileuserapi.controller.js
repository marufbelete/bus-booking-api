const Schedule = require("../models/schedule.model");
const moment =require("moment")
const mongoose = require("mongoose");
const { shuffle } = require("lodash");
//create schedules need io here
//mob
exports.getMobileSchgedule=async(req,res,next)=>{
  try{
    let filter={}
    let departure_date
    let orgarray
    const now=new Date()
    let option1={}
    const {freeSit,source,destination,departureDate,organization}=req.query
    let dep_date=moment(new Date(departureDate)).dayOfYear()
    console.log(dep_date)
    if(freeSit){
      option1={"sitLeft":{$gte:Number(freeSit)}}
     }
    if(organization){
      orgarray=JSON.parse(organization)
    }
    let today =moment(now).dayOfYear();
    if(!source||!destination)
    {
      const error = new Error("please fill both source and destination field")
      error.statusCode = 400
      throw error;
    }
    organization?filter.organizationCode={$in:orgarray}:filter=filter
    source?filter.source=source:filter=filter
    destination?filter.destination=destination:filter=filter
    departureDate?departure_date=dep_date:departure_date=today+1
    const schedule=await Schedule.aggregate([
      {$match:{...filter
        ,$and: [{$expr:{ $eq:[{$dayOfYear:"$departureDateAndTime"},departure_date]}},
      {$expr:{$lt:[{$size:"$occupiedSitNo"},"$totalNoOfSit"]}}]
  }},
  {
    $lookup:{
      from:'organizations',
      foreignField:"organizationCode",
      localField:"organizationCode",
      as:"organization"
    }
    },
    {$project:{"day":{$dayOfYear:"$departureDateAndTime"},
    "organizationName":{$arrayElemAt:["$organization.organizationName",0]},
    "source":1,"destination":1,"departureDateAndTime":1,"distance":1,
    "estimatedHour":1,"tarif":1,"sitLeft":{$subtract:["$totalNoOfSit",
    {$size:"$occupiedSitNo"}]}}},
    {
      $match:option1
    }

    ])
    const shuffle_result=shuffle(schedule)
    return res.json(shuffle_result)
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
   const passangerPhone=req.body.passangerPhone;
   const change=await Schedule.findOneAndUpdate({_id:schedule_id},
    {$set:{"passangerInfo.$[el].passangerName":passangerName,
   "passangerInfo.$[el].passangerPhone":passangerPhone}},
   {arrayFilters:[{"el.uniqueId":ticket_id}],
    new:true,useFindAndModify:false})
   if((change?.passangerInfo.filter(e=>e.uniqueId==ticket_id)).length==0)
   {
    const error = new Error("passanger not found")
    error.statusCode = 400
    throw error;
   }
    return res.json({message:"passagner info updated",status:true})
  }
  catch(error) {
    next(error)
  }
};

exports.getTicketHistory=async(req,res,next)=>{
  try{
    const user_id=mongoose.Types.ObjectId(req.userinfo.sub)
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
  $match:{"passangerInfo.bookedBy":user_id}
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
//cancel mastermind sort
exports.cancelTicket = async (req, res, next) => {
  try {
    const schedule_id=req.params.id
    const pass_id=req.body.uniqueId
    const pass_sit=req.body.passangerSit
    const timenow = new Date
    const schedule=await Schedule.findById(schedule_id)
    if(moment(schedule.departureDateAndTime).isAfter(timenow))
    { 
      const schedule_info=await Schedule.findById(schedule_id,{passangerInfo:1})
      if(schedule_info.passangerInfo?.filter(e=>e.uniqueId===pass_id).length==0)
      {
        const error=new Error("sit number doesn't match with passanger id")
        error.statusCode=401
        throw error
      }
      await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].sitCanceled":pass_sit,
      "passangerInfo.$[el].isTicketCanceled":true},$pull:{occupiedSitNo: pass_sit }},
      {arrayFilters:[{"el.uniqueId":pass_id}],new:true,useFindAndModify:false})
      
      return res.json({meaage:"sit canceled. please contact bus ticket office for your refund"})
    }
    const error=new Error("departure time passed. please contact bus ticket office")
    error.statusCode=401
    throw error
  }
  catch(error) {
    next(error)
  }
}
//driver get my pass
exports.getMyPassanger=async(req,res,next)=>{
  try{
    if(!req?.userinfo?.sub){
      const error=new Error("driver not found")
      error.statusCode=401
      throw error
      }
    const driver_id=mongoose.Types.ObjectId(req.userinfo.sub)
    console.log(driver_id)
   
    const now =new Date()
    const schedule=await Schedule.aggregate([
{
    $project:{"after3":{
      $dateAdd: {
        startDate:"$departureDateAndTime",
        unit:"day",
        amount:240,
     }
    },
   "before8":{
    $dateSubtract: {
      startDate:"$departureDateAndTime",
      unit:"day",
      amount:240,
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
const pass_data={

}
if(schedule.length>0)
{
  const general_info={
  source: schedule[0]?.source,
  destination: schedule[0]?.destination,
  tarif:schedule[0]?.tarif,
  distance: schedule[0]?.distance,
  estimatedHour: schedule[0]?.estimatedHour,
  departureDateAndTime: schedule[0]?.departureDateAndTime,
  busPlateNo: schedule[0]?.busPlateNo,
  organizationName:schedule[0]?.organizationName
}
  pass_data.general_info=general_info
}
const passanger=schedule?.map(e=>({
passangerName: e.passangerName,
passangerPhone: e.passangerPhone,
ticketId: e.ticketId,
bookedAt:e.bookedAt ,
passangerSit:e.passangerSit}))
pass_data.passanger=passanger
    return res.json(pass_data)
  }
  catch(error) {
    next(error)
  }
}
