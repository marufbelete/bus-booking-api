const Schedule = require("../models/schedule.model");
const Bus = require("../models/bus.model");
const Location=require('../models/Date_Location.model')
const moment=require('moment')
const mongoose = require("mongoose");
// const Load= require('lodash');
const User = require("../models/user.model");
const {onlyUnique}=require('../helpers/uniqueArr');
const {checkIfArrayIsUnique}=require('../helpers/checkUnique')
const {randomFixedInteger}=require('../helpers/generatendigit')
const Organization = require("../models/organization.model");
const Managecash = require("../models/managelocalcash.model");
const Manageagentcash=require("../models/manageagentcash.model");
exports.addSchedule = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()  
  try {
    const description=req.body.description;
    const source=req.body.source;
    const destination=req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date_and_time= new Date(req.body.depdateandtime);
    const departure_place = req.body.depplace?req.body.depplace:null;
    const busid=req.body.assignedbus?req.body.assignedbus:null
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
    if(busid){
      const busInfo=await Bus.findById(busid)
      const number_sit=busInfo.totalNoOfSit
      newschedule.totalNoOfSit=number_sit
    }
    const organization=await Organization.findOne({organizationCode:orgcode})
    const prefix=`${source}-${destination} @schedule`
    let lastSchedule=organization.lastSchedule
    for(let i=0;i<number_of_schedule;i++)
    {
      lastSchedule++
      const scheduleId=`${prefix}-${Number(lastSchedule)}`
      newschedule.scheduleId=scheduleId
      schedules.push({...newschedule})
    } 
    organization.lastSchedule=Number(lastSchedule)
    await organization.save({session})
    const savedSchedule=await Schedule.insertMany(schedules,{session})
    if(busid)
    {
      const businfo=await Bus.findById(busid)
      const is_not_free=businfo.assigneDate?.map(e=>e.getDate())
      .includes(departure_date_and_time?.getDate())
      const nex_day=moment(departure_date_and_time).add(1,'d')
      if(is_not_free)
      {
        const error=new Error("This bus is alredy assigned for the given date")
        error.statusCode=401
        throw error
      }
      const location=new Location({        
        location:destination,
        date:nex_day,
        busId:busid,
        assigneDate:departure_date_and_time,
        organizationCode:orgcode})
      await location.save({session})
    }
  
    await session.commitTransaction()
    return res.json(savedSchedule)
  }  
  else
  {
    const error=new Error("Please fill all required field")
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
  const session=await mongoose.startSession()
  session.startTransaction()  
  try {
   const id=req.params.id
   const sit =req.body.sits
   if(!checkIfArrayIsUnique(sit))
   {
    const error=new Error("duplicate sit error")
    error.statusCode=400
    throw error
   }
   const schedule=await Schedule.findById(id)
   const timenow = new Date
   if(schedule&&moment(schedule.departureDateAndTime).isBefore(timenow))
    {
      const error=new Error("closed schedule, please try again")
      error.statusCode=401
      throw error
    }
   if(schedule.occupiedSitNo.some(e=>sit.includes(e))||schedule.tempOccupiedSitNo.some(e=>sit.includes(e)))
   {
    const error=new Error("sit already reserved before, please try another sit")
    error.statusCode=400
    throw error
   }
   else{
    const reserve= await Schedule.findByIdAndUpdate(id,{
      $addToSet:{
       tempOccupiedSitNo:{$each:sit}
      }
    },{new:true,useFindAndModify:false,session})
    const unlockSit=async()=>{ 
    await Schedule.findByIdAndUpdate(id,{
       $pullAll:{
        tempOccupiedSitNo:sit
        }
    },{new:true,useFindAndModify:false,session})
 }
    //socket io 
    setTimeout(unlockSit,195000)
    const reserved_sit=[...reserve.tempOccupiedSitNo,...reserve.occupiedSitNo]
    const uninque_reserved=reserved_sit.filter(onlyUnique)
    await session.commitTransaction()
    return res.json({reserve:uninque_reserved})
   }
   
  }
  catch(error) {
    await session.abortTransaction();
    next(error)
  }
}
//book ticket use io
exports.bookTicketFromSchedule = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction() 
  try {
   const id=req.params.id
   let tickets=[]
   let passlength=req.body.length
   const sitArr=req.body?.map(e=>e.sits)
   if(!checkIfArrayIsUnique(sitArr))
   {
    const error=new Error("duplicate sit error")
    error.statusCode=400
    throw error
   }
    const schedule=await Schedule.findById(id)
    const timenow = new Date
    if(schedule&&moment(schedule.departureDateAndTime).isBefore(timenow))
     {
       const error=new Error("closed schedule, please try again")
       error.statusCode=401
       throw error
     }
    const organization=await Organization.findOne({organizationCode:schedule.organizationCode})
    const now=new Date()
    const prefix=`${organization.organizationName}-${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`
    let lastTicket=organization.lastTicket
    const booked_by = req.userinfo.sub;
    const bookerRole=req.userinfo.user_role
  for(let i=0;i<passlength;i++)
    {
    lastTicket++
    const passange_name = req.body[i].passname;
    const pass_phone_number = req.body[i].passphone;
    const psss_ocupied_sit_no= req.body[i].sits
    const uid = `${prefix}-${lastTicket}`
    if(schedule.occupiedSitNo.includes(psss_ocupied_sit_no))
    {
     const error=new Error(`sit No ${psss_ocupied_sit_no} already reserved before, please try another sit`)
     error.statusCode=400
     throw error
    }
    if(schedule.tempOccupiedSitNo.includes(psss_ocupied_sit_no))
    {
      const new_ticket={
        passangerName:passange_name,
        passangerPhone:pass_phone_number,
        passangerOccupiedSitNo:psss_ocupied_sit_no,
        uniqueId:uid,
        confirmationNumber:randomFixedInteger(6),
        bookedBy:booked_by}
        tickets.push(new_ticket)
        await Schedule.findByIdAndUpdate(id,{
        $push:{passangerInfo:new_ticket},
        $addToSet:{occupiedSitNo:psss_ocupied_sit_no},
     },{new:true,useFindAndModify:false,session})
    }
    else{
      const error=new Error("Your Sit Reservation Already Expired Please Try Again")
      error.statusCode=400
      throw error
  }
}
    organization.lastTicket=lastTicket
    await organization.save({session})
   if(bookerRole===process.env.CASHER)
   {
      const totalCash=Number(schedule.tarif)*passlength
      await Managecash.findOneAndUpdate({user:booked_by},
      {$inc:{cashInHand:totalCash}},
      {new:true,useFindAndModify:false,session})
   }
   if(bookerRole===process.env.CASHERAGENT)
   {
      const totalCash=Number(schedule.tarif)*passlength
      const user=await User.findById(booked_by)
      await Manageagentcash.findOneAndUpdate({agent:user.agentId},
      {$inc:{cashInHand:totalCash}},
      {new:true,useFindAndModify:false,session})
   }
   await session.commitTransaction()
   return res.json({message:"success",ticket:tickets,status:true})
  }
  catch(error) {
    await session.abortTransaction();
    next(error)
  }
};

exports.getAllSchgedule=async(req,res,next)=>{
  try{
    const orgcode =req.userinfo.organization_code;
    const now =new Date()
    const schedule=await Schedule.find({
        organizationCode:orgcode,isTripCanceled:false,
        departureDateAndTime:{$gte:now}
  })
    return res.json(schedule)
  }
  catch(error) {
    next(error)
  }
}

exports.getAllFilterSchgedule=async(req,res,next)=>{
  try{
    const orgcode =req.userinfo.organization_code;
    const schedule=await Schedule.find({organizationCode:orgcode},
      {source:1,scheduleId:1,destination:1,departureDateAndTime:1})
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
    // const pas=await Schedule.findOne({organizationCode:orgcode,_id:id})
    // console.log(pas.passangerInfo)
    const schedule=await Schedule.aggregate([
      {
        $match:{organizationCode:orgcode,_id:id}
      },
      {
        $unwind:"$passangerInfo"
      },
      {
        $project:{"departureDateAndTime":1,"passangerName":"$passangerInfo.passangerName","tarif":1,
        "bookedAt":"$passangerInfo.bookedAt","passangerId":"$passangerInfo.uniqueId","isTripCanceled":1,
        "isTicketCanceled":"$passangerInfo.isTicketCanceled","isTicketRefunded":"$passangerInfo.isTicketRefunded",
        "sit":"$passangerInfo.passangerOccupiedSitNo",
        "phoneNumber":"$passangerInfo.passangerPhone","status":{$cond:[{$gt:["$departureDateAndTime",now]},
        "To Be Departed","Departed"]}}
      },
      {
        $project:{"departureDateAndTime":1,"passangerName":1,"tarif":1,"sit":1,"isTripCanceled":1,
        "isTicketRefunded":1,"passangerId":1,"bookedAt":1,"phoneNumber":1,"status":{$cond:[{$eq:[true,"$isTicketCanceled"]},
        "Canceled Sit","$status"]}}
      },
      {
        $project:{"departureDateAndTime":1,"passangerName":1,"tarif":1,"sit":1,"isTicketRefunded":1,
        "passangerId":1,"bookedAt":1,"phoneNumber":1,"status":{$cond:[{$eq:[true,"$isTripCanceled"]},
        "Canceled Trip","$status"]}}
      },
      {
        $project:{"departureDateAndTime":1,"passangerName":1,"tarif":1,"sit":1,"passangerId":1,
        "bookedAt":1,"phoneNumber":1,"status":{$cond:[{$eq:[true,"$isTicketRefunded"]},
        "Refunded","$status"]}}
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
  try{
const orgcode =req.userinfo.organization_code;
const now =new Date()
const schedule=await Schedule.aggregate([
  {
    $match:{organizationCode:orgcode}
  },
  {
    $project:{"_id":1,"scheduleId":1,"source":1,"destination":1,"reservedSit":{$size:"$occupiedSitNo"},
    "isTripCanceled":1,"tarif":1,"departurePlace":1,"bus":"$assignedBus","departureDateAndTime":1,
    "status":{$cond:[{$gt:["$departureDateAndTime",now]},"Not Departed","Departed"]}}
  },
  {
    $project:{"_id":1,"scheduleId":1,"source":1,"destination":1,"reservedSit":1,"tarif":1,"departureDateAndTime":1,
    "departurePlace":1,"bus":1,"status":{$cond:[{$eq:[true,"$isTripCanceled"]},"Canceled","$status"]}}
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
  return res.json(allSchedule)
  }
  catch(error) {
    next(error)
  }
};
//
exports.getRiservedSit = async (req, res, next) => {
  try {
   const id=req.params.id
   const sitInfo= await Schedule.findById(id,{
    occupiedSitNo:1,totalNoOfSit:1,tempOccupiedSitNo:1
   })
   const reserved_sit=[...sitInfo.tempOccupiedSitNo,...sitInfo.occupiedSitNo]
    const uninque_reserved=reserved_sit.filter(onlyUnique)
    const info={uninque_reserved,totalNoOfSit:sitInfo.totalNoOfSit}
   return res.json(info)
  }
  catch(error) {
    next(error)
  }
};

//assign bus iopost add transaction
exports.assignBusToSchedule = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction()
  try {
   const id=req.params.id
   const bus= req.body.bus;
   const departurePlace=req.body.departureplace
   const orgcode =req.userinfo.organization_code;
   const timenow=new Date()
   const sheduleinfo=await Schedule.findOne({_id:id,departureDateAndTime:{$gte:timenow}})
   console.log(sheduleinfo)
   if(!sheduleinfo)
   {
    const error=new Error("trip departure time already expired")
    error.statusCode=401
    throw error
   }
   const location_track=await Location.find({busId:bus})
   const assign_date=location_track?.map(e=>e?.assigneDate)
   const is_not_free=assign_date.map(e=>moment(e).dayOfYear())
   .includes(moment(sheduleinfo.departureDateAndTime).dayOfYear())
   const nex_day=moment(sheduleinfo.departureDateAndTime).add(1,'d')
   const is_bus_assigned_before=sheduleinfo.assignedBus

   if(is_not_free&&is_bus_assigned_before!=bus)
   {
    const error=new Error("this bus is alredy assigned for the given date")
    error.statusCode=401
    throw error
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
   const update_option={assignedBus:bus,departurePlace}
   if(is_bus_assigned_before!=bus)
   {
    const busInfo=await Bus.findById(bus)
    const number_sit=busInfo.totalNoOfSit
    update_option.totalNoOfSit=number_sit
   }
   const buses= await Schedule.findOneAndUpdate(
    {_id:id,departureDateAndTime:{$gte:timenow}},
    {$set:{
     ...update_option
     }
   },{new:true,useFindAndModify:false,session})
  const location=new Location({
    date:nex_day,
    location:sheduleinfo.destination,
    busId:bus,
    organizationCode:orgcode,
    assigneDate:sheduleinfo.departureDateAndTime,
  })  
   await location.save({session})//location save
   session.commitTransaction()
   return res.json({_id:buses._id,assignedBus:buses.assignedBus,
    departurePlace:buses.departurePlace})
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
   const schedule_info= await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:
    {$gte:timenow}},{$set:{
      departureDateAndTime:departureDateAndTime
     }
   })
   //change location info of bus
   const next_date=moment(departureDateAndTime).add(1,'d')
   await Location.findOneAndUpdate({busId:schedule_info.bus,
    date:schedule_info.departureDateAndTime},{
    $set:{
      date:next_date,
      assigneDate:departureDateAndTime
    }
   })
   return res.json({message:"success for departure date and time change"})
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
   const timenow=new Date()
   const sheduleinfo=await Schedule.findOne({_id:schedule_id,
    departureDateAndTime:{$gte:timenow}})
   if(!sheduleinfo)
   {
    const error=new Error("trip departure time already expired")
    error.statusCode=401
    throw error
   }
   await Schedule.findByIdAndUpdate(schedule_id,{$set:
    {"passangerInfo.$[el].passangerName":passangerName,
    "passangerInfo.$[el].passangerPhone":passangerPhone}},
     {arrayFilters:[{"el.uniqueId":pass_id}],new:true,useFindAndModify:false})
      return res.json({message:"passanger info updated",success:true})
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
  const update_schedule=await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isTripCanceled:true,
  assignedBus:null,
  canceledBy:canceler_id}},{session})
   if(!update_schedule)
   {
    const error=new Error("already departed schedule can't calceled")
    error.statusCode=401
    throw error
   }
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
   const timenow=new Date()
   const undo_schedule=await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},
    {$set:{
    isTripCanceled:false,
   }})
   if(!undo_schedule)
   {
    const error=new Error("departure time expired can't undo this schedule")
    error.statusCode=401
    throw error
   }
   return res.json({message:"schedule undo completed",status:true})
  }
  catch(error) {
    next(error)
  }
};
exports.checkTicketExist=async(req,res,next)=>{
  try{
  const schedule_id=req.query.scheduleId
  const ticket_id=req.query.ticketId
  if(!(schedule_id&&ticket_id))
  {
    const error=new Error("plsease set all field")
    error.statusCode=401
    throw error
  }
  const isTicketExist=await Schedule.findOne({_id:schedule_id,"passangerInfo.uniqueId":ticket_id}) 
  if(isTicketExist)
  {
  await Schedule.findByIdAndUpdate(schedule_id,
  {$set:{"passangerInfo.$[el].isPassangerDeparted":true}},
  {arrayFilters:[{"el.uniqueId":ticket_id}],new:true,useFindAndModify:false})
   return res.json({message:"Ticket Exist",status:true})
  }
  const error=new Error("No Ticket Found")
  error.statusCode=401
  throw error
  }
  catch(error) {
    next(error)
  }
}
