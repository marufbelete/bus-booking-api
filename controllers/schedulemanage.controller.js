const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const moment=require('moment')
const ShortUniqueId = require('short-unique-id');
//create schedules need io here
let sitTimer;
let unlockSit=()=>{};
exports.addSchedule = async (req, res, next) => {
  try {
    console.log(req.body)
    const description=req.body.description;
    const source = req.body.source;
    const destination = req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date_and_time= req.body.depdateandtime;
    const departure_place = req.body.depplace;
    const busid=req.body.assignedbus
    const number_of_schedule = req.body.numberofschedule?req.body.numberofschedule:1;
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
      console.log("once")
      schedules.push(newschedule)
    }   
    const savedSchedule=await Schedule.insertMany(schedules)
    console.log(schedules)
    return res.json(savedSchedule)
  }
  ///make transaction
   await Bus.findByIdAndUpdate(busid,{
    $set:{
     onduty:true
    }
  }
  ,{new:true})
  const error=new Error("please fill all required field")
  error.statusCode=401
  throw error
  }
catch(error) {
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
    const schedule=await Schedule.find({organizationCode:orgcode,isTripCanceled:false,departureDateAndTime:{$gte:now}},{source:1,destination:1})
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}
exports.getSchgeduleById=async(req,res,next)=>{
  try{
    const id=req.params.id
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.findById(id)
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
    console.log("in")
    clearTimeout(sitTimer)
    unlockSit()
   const id=req.params.id
   const passange_name = req.body.passname;
   const pass_phone_number = req.body.passphone;
   const psss_ocupied_sit_no= req.body.sits
   const booked_by = req.userinfo.sub;
   const uid = new ShortUniqueId({ length: 12 });
   console.log(uid())
   const isSitFree=await Schedule.findById(id)
   if(isSitFree.occupiedSitNo.some(e=>psss_ocupied_sit_no.includes(e)))
   {
    return res.json({message:"sit already reserved before, please try another sit"});
   }
   const schedule= await Schedule.findByIdAndUpdate(id,{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       passangerOccupiedSitNo:psss_ocupied_sit_no,
       uniqueId:uid(),
       bookedBy:booked_by}},
       $addToSet:{occupiedSitNo:{$each:psss_ocupied_sit_no}},
   },{new:true})
   return res.json(schedule)
  }
  catch(error) {
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

