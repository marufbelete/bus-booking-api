const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const moment=require('moment')
const mongoose = require("mongoose");
const Load= require('lodash');

const ShortUniqueId = require('short-unique-id');
//create schedules need io here
let sitTimer;
let unlockSit=()=>{};
exports.addSchedule = async (req, res, next) => {
  console.log(req.body)
  const session=await mongoose.startSession()
  try {
    session.startTransaction()  
    const description=req.body.description;
    const source=req.body.source;
    const destination=req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date_and_time= req.body.depdateandtime;
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
      await Bus.findByIdAndUpdate(busid,{
        $set:{
         onduty:true
        }
      }
      ,{new:true,session})
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
  console.log(error)

  await session.abortTransaction();
next(error);
  }
};
//lock sit 
exports.lockSit = async (req, res, next) => {
  try {
   const id=req.params.id
   const sit =req.body.sits
    console.log(sit)
   const isSitFree=await Schedule.findById(id)
   if(isSitFree.occupiedSitNo.some(e=>sit.includes(e)))
   {
    return res.json({message:"sit already reserved before, please try another sit"});
   }
   else{
    const bus= await Schedule.findByIdAndUpdate(id,{
      $addToSet:{
       occupiedSitNo:{$each:sit}
      }
    }
    ,{new:true})
    console.log(bus)
   unlockSit=async()=>{ 
     await Schedule.findByIdAndUpdate(id,{
       $pullAll:{
         occupiedSitNo:sit
        }
    },{new:true,useFindAndModify:false})
 }
    //socket io 
    sitTimer=setTimeout(unlockSit,30000)
    req.sitlock=sitTimer
    return res.json(bus)
   }
   
  }
  catch(error) {
    next(error)
  }
}
exports.getAllSchgedule=async(req,res,next)=>{
  try{
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.find({organizationCode:orgcode,isTripCanceled:false,departureDateAndTime:{$gte:now}})
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
    console.log(id)
    const schedule=await Schedule.aggregate([
      {
        $match:{organizationCode:orgcode,_id:id}
      },
      {
        $unwind:"$passangerInfo"
      },
      {
        $project:{"passangerName":"$passangerInfo.passangerName","tarif":1,"bookedAt":"$passangerInfo.bookedAt","passangerId":"$passangerInfo.uniqueId","isTicketCanceled":"$passangerInfo.isTiacketCanceled","sit":"$passangerInfo.passangerOccupiedSitNo","phoneNumber":"$passangerInfo.passangerPhone","status":{$cond:[{$gt:["$departureDateAndTime",now]},"To Be Departed","Departed"]}}
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

//book ticket use io
exports.bookTicketFromSchedule = async (req, res, next) => {
  try {
    clearTimeout(sitTimer)
    unlockSit()
   const id=req.params.id
   let passlength=req.body.length
   console.log(req.body)
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
     return res.json({message:`sit ${psss_ocupied_sit_no} already reserved before, please try another sit`});
    }
    await Schedule.findByIdAndUpdate(id,{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       passangerOccupiedSitNo:psss_ocupied_sit_no,
       uniqueId:uid(),
       bookedBy:booked_by}},
       $addToSet:{occupiedSitNo:psss_ocupied_sit_no},
   },{new:true})
   }
   return res.json("done")
  }
  catch(error) {
    console.log(error)
    next(error)
  }
};
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
    occupiedSitNo:1
   })
   return res.json(bus)
  }
  catch(error) {
    next(error)
  }
};

//assign bus iopost
exports.assignBusToSchedule = async (req, res, next) => {
  try {
   const id=req.params.id
   const bus= req.body.bus;
   const departurePlace=req.body.departurePlace
   const departureDateAndTime=req.body.departureDateAndTime
   const timenow=Date.now()
   const buses= await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{
     $set:{
      assignedBus:bus,
      departurePlace,
      departureDateAndTime
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
  try {
  //find and copmare the date if pass dont cancel
   const id=req.params.id
   const canceler_id=req.userinfo.sub
   const timenow=Date.now()
   await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isTripCanceled:true,
  canceledBy:canceler_id
   }})
  return res.json("deleted successfully")
  }
  catch(error) {
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
   const timenow=Date.now()
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

