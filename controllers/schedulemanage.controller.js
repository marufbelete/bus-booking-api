const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const Location=require('../models/Date_Location.model')
const moment=require('moment')
const mongoose = require("mongoose");
const Load= require('lodash');
const ShortUniqueId = require('short-unique-id');
let sitTimer;
let unlockSit=()=>{};
let isSitReserved=false;
exports.addSchedule = async (req, res, next) => {
  const session=await mongoose.startSession()
  try {
    session.startTransaction()  
    const description=req.body.description;
    const source=req.body.source;
    const destination=req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date_and_time= new Date(req.body.depdateandtime);
    const departure_place = req.body.depplace?req.body.depplace:null;
    const busid=req.body.assignedbus?req.body.assignedbus:null
    const number_of_schedule = req.body.numberofschedule?e.numberofschedule:1;
    const created_by =req.userinfo.sub;
    const orgcode =req.userinfo.organization_code;
    if(!!source && !!destination && !! tarif && !!departure_date_and_time)
   {
    const schedules=[]
    const newschedule= {
      description:description,
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      departureDateAndTime:departure_date_and_time,
      departurePlace:departure_place,
      createdBy:created_by,
      organizationCode:orgcode,
      assignedBus:busid
    }
    for(let i=0;i<number_of_schedule;i++)
    {
      schedules.push(newschedule)
    } 
    const savedSchedule=await Schedule.insertMany(schedules,{session})
    if(busid)
    {
      const businfo=await Bus.findById(busid)
      const is_not_free=businfo.assigneDate?.map(e=>e.getDate()).includes(departure_date_and_time?.getDate())
      const nex_day=moment(departure_date_and_time).add(1,'d')
      if(is_not_free)
      {
       return res.json({message:"this bus is alredy assigned for the given date"})
      }
      const location=new Location({        
        location:destination,
        date:nex_day,
        busId:busid,
        assigneDate:departure_date_and_time,
        organizationCode:orgcode})
      await location.save({session})
    }
  
    session.commitTransaction()
    return res.json(savedSchedule)
  }  
  else
  {
    const error=new Error("please fill all required field")
    error.statusCode=401
    throw error
  }

  }
catch(error) {
  await session.abortTransaction();
  next(error);
  }
};
//lock sit 
exports.lockSit = async (req, res, next) => {
  try {
   const id=req.params.id
   const sit =req.body.sits
   if(isSitReserved)
   {
    clearTimeout(sitTimer)
    await unlockSit()
   }
   const isSitFree=await Schedule.findById(id)
   if(isSitFree.occupiedSitNo.some(e=>sit.includes(e)))
   {
    const error=new Error("sit already reserved before, please try another sit")
    error.statusCode=400
    throw error
   }
   else{
    const reserve= await Schedule.findByIdAndUpdate(id,{
      $addToSet:{
       occupiedSitNo:{$each:sit}
      }
    },{new:true,useFindAndModify:false})
    isSitReserved=true
    unlockSit=async()=>{ 
    isSitReserved=false
    const unlocking= await Schedule.findByIdAndUpdate(id,{
       $pullAll:{
         occupiedSitNo:sit
        }
    },{new:true,useFindAndModify:false})
    return unlocking
 }
    //socket io 
    sitTimer=setTimeout(unlockSit,150000)
    req.sitlock=sitTimer
    return res.json(reserve)
   }
   
  }
  catch(error) {
    next(error)
  }
}
//book ticket use io
exports.bookTicketFromSchedule = async (req, res, next) => {
  try {
    if(isSitReserved)
    {
    clearTimeout(sitTimer)
    await unlockSit()
   const id=req.params.id
   let passlength=req.body.length
   for(let i=0;i<passlength;i++)
     {
    const passange_name = req.body[i].passname;
    const pass_phone_number = req.body[i].passphone;
    const psss_ocupied_sit_no= req.body[i].sits
    const booked_by = req.userinfo.sub;
    const uid = new ShortUniqueId({ length: 12 });
    const isSitFree=await Schedule.findById(id)
    if(isSitFree.occupiedSitNo.includes(psss_ocupied_sit_no))
    {
     const error=new Error(`sit ${psss_ocupied_sit_no} already reserved before, please try another sit`)
     error.statusCode=400
     throw error
    }
    const new_ticket={
      passangerName:passange_name,
      passangerPhone:pass_phone_number,
      passangerOccupiedSitNo:psss_ocupied_sit_no,
      uniqueId:uid(),
      bookedBy:booked_by}
    await Schedule.findByIdAndUpdate(id,{
      $push:{passangerInfo:new_ticket},
       $addToSet:{occupiedSitNo:psss_ocupied_sit_no},
   },{new:true,useFindAndModify:false})
   return res.json({message:"success",ticket:new_ticket,status:true})
   }
  }
  else{
    const error=new Error("Your Sit Reservation Already Expired Please Try Again")
    error.statusCode=400
    throw error
  }
  }
  catch(error) {
    next(error)
  }
};
exports.getAllSchgedule=async(req,res,next)=>{
  try{
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.find({organizationCode:orgcode,isTripCanceled:false,departureDateAndTime:{$gte:now},$expr: { $lt: [ {$size:"$occupiedSitNo"},"$totalNoOfSit" ] }})
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
exports.getAllFilterSchgedule=async(req,res,next)=>{
  try{
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.find({organizationCode:orgcode},{source:1,destination:1,departureDateAndTime:1})
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
exports.getSchgeduleById=async(req,res,next)=>{
  try{
    const id=mongoose.Types.ObjectId(req.params.id)
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.aggregate([
      {
        $match:{organizationCode:orgcode,_id:id}
      },
      {
        $unwind:"$passangerInfo"
      },
      {
        $project:{"passangerName":"$passangerInfo.passangerName","tarif":1,"bookedAt":"$passangerInfo.bookedAt","passangerId":"$passangerInfo.uniqueId","isTripCanceled":1,"isTicketCanceled":"$passangerInfo.isTiacketCanceled","sit":"$passangerInfo.passangerOccupiedSitNo","phoneNumber":"$passangerInfo.passangerPhone","status":{$cond:[{$gt:["$departureDateAndTime",now]},"To Be Departed","Departed"]}}
      },
      {
        $project:{"passangerName":1,"tarif":1,"sit":1,"isTicketCanceled":1,"passangerId":1,"bookedAt":1,"phoneNumber":1,"status":{$cond:[{$eq:[true,"$isTripCanceled"]},"Canceled Trip","$status"]}}
      },
      {
        $project:{"passangerName":1,"tarif":1,"sit":1,"passangerId":1,"bookedAt":1,"phoneNumber":1,"status":{$cond:[{$eq:[true,"$isTicketCanceled"]},"Refunded","$status"]}}
      },
    
    ])
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
//get all schedule
exports.getAllSpecialSchgedule=async(req,res,next)=>{
 //departureDateAndTime:{$gte:now}
  try{
const orgcode =req.userinfo.organization_code;
const now =new Date()
const schedule=await Schedule.aggregate([
  {
    $match:{organizationCode:orgcode}
  },
  {
    $project:{"_id":1,"source":1,"destination":1,"reservedSit":{$size:"$occupiedSitNo"},"isTripCanceled":1,"tarif":1,"departurePlace":1,"bus":"$assignedBus","departureDateAndTime":1,"status":{$cond:[{$gt:["$departureDateAndTime",now]},"Not Departed","Departed"]}}
  },
  {
    $project:{"_id":1,"source":1,"destination":1,"reservedSit":1,"tarif":1,"departureDateAndTime":1,"departurePlace":1,"bus":1,"status":{$cond:[{$eq:[true,"$isTripCanceled"]},"Canceled","$status"]}}
  }
])
return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}


//by route
exports.getActiveScheduleByRoute = async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const search={organizationCode:orgcode}
  req.query.source?search.source=req.query.source:''
  req.query.destination?search.destination=req.query.destination:''
  const allSchedule= await Schedule.find(search)
  res.json(allSchedule)
  }
  catch(error) {
    next(error)
  }
};
//
exports.getRiservedSit = async (req, res, next) => {
  try {
   const id=req.params.id
   const bus= await Schedule.findById(id,{
    occupiedSitNo:1,totalNoOfSit:1
   })
   return res.json(bus)
  }
  catch(error) {
    next(error)
  }
};

//assign bus iopost add transaction
exports.assignBusToSchedule = async (req, res, next) => {
  const session=await mongoose.startSession()
  try {
   const id=req.params.id
   const bus= req.body.bus;
   const departurePlace=req.body.departureplace
   const orgcode =req.userinfo.organization_code;
   const assign_date=await Location.find({busId:bus})
   const sheduleinfo=await Schedule.findById(id)
   const businfo=assign_date?.map(e=>e?.assigneDate)
   const is_not_free=businfo.map(e=>e.getDate()).includes(sheduleinfo.departureDateAndTime.getDate())
   const timenow=new Date()
   const nex_day=moment(sheduleinfo.departureDateAndTime).add(1,'d')
   const is_bus_assigned_before=sheduleinfo.assignedBus
   session.startTransaction()
   if(is_not_free)
   {
    return res.json({message:"this bus is alredy assigned for the given date"})
   }
   if(is_bus_assigned_before)
   {
      await Location.deleteOne({
        date:nex_day,
        assigneDate:sheduleinfo.departureDateAndTime,
        busId:is_bus_assigned_before,
        organizationCode:orgcode
      },{session})
   }
   
   const buses= await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:
    {$gte:timenow}},{
     $set:{
      assignedBus:bus,
      departurePlace,
     }
   },{useFindAndModify:false,session})
  const location=new Location({
    date:nex_day,
    location:sheduleinfo.destination,
    busId:bus,
    organizationCode:orgcode,
    assigneDate:sheduleinfo.departureDateAndTime,
  })  
   await location.save({session})
   session.commitTransaction()
   return res.json({_id:buses._id,assignedBus:buses.assignedBus,departurePlace:buses.departurePlace})
  }
  catch(error) {
    session.abortTransaction()
    next(error)
  }
};
//update date and time
exports.updateScheduleDateAndTime = async (req, res, next) => {
  try {
   const id=req.params.id
   const departureDateAndTime=req.body.departureDateAndTime
   const timenow=new Date()
   const buses= await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:
    {$gte:timenow}},{$set:{
      departureDateAndTime:departureDateAndTime
     }
   })
   return res.json(buses)
  }
  catch(error) {
    next(error)
  }
};

//update passanger info
exports.updatePassinfo = async (req, res, next) => {
  try {
   const schedule_id=req.params.id
   const pass_id= req.body.passangerId;
   const passangerName=req.body.passangerName;
   const passangerPhone=req.body.phoneNumber;
   await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].passangerName":passangerName,"passangerInfo.$[el].passangerPhone":passangerPhone}},
     {arrayFilters:[{"el.uniqueId":pass_id}],new:true,useFindAndModify:false})
      return res.json("done")
  }
  catch(error) {
    next(error)
  }
};

//cancel schedule io
exports.cancelSchedule= async (req, res, next) => {
  const session=await mongoose.startSession()
  try {
  //find and copmare the date if pass dont cancel
   const id=req.params.id
   const canceler_id=req.userinfo.sub
   const timenow=new Date()
   const sheduleinfo=await Schedule.findById(id)
   const bus_id=sheduleinfo.assignedBus
   const orgcode =req.userinfo.organization_code;
   session.startTransaction()
  await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isTripCanceled:true,
  canceledBy:canceler_id
   }},{session})
   if(bus_id)
   {
   const nex_day=moment(sheduleinfo.departureDateAndTime).add(1,'d')
    await Location.deleteOne({
      date:nex_day,
      busId:bus_id,
      organizationCode:orgcode,
      assigneDate:sheduleinfo.departureDateAndTime
    },{session})
   }
   session.commitTransaction()
  return res.json({message:"schedule canceled successfully",status:true})
  }
  catch(error) {
    session.abortTransaction()
    next(error)
  }
};
// undo cancel
exports.undoCanceldSchedule= async (req, res, next) => {
  try {
    // delete cancel_by
  //find and copmare the date if pass dont cancel
   const id=req.params.id
   const canceler_id=req.userinfo.sub
   const timenow=new Date()
   await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isCanceled:false,
  canceledBy:canceler_id
   }})
   return res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};

