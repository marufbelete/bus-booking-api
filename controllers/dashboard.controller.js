const Schedule = require("../models/schedule.model");
const {milliSecond}=require("../helpers/sit_generator")
const moment=require("moment")
//booked sit of each trip return sour,dest,totalsit,reservedsit we can time interval
const todays=new Date()


exports.getAllScheduleWithSit = async (req, res, next) => {
  try{
  const today=new Date()
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode,departureDateAndTime:{$lte:today}}
  },
  {
    $project:{"year":{ $year:"$createdAt" },"source":"$source","destination":"$destination","totalSit":"$totalNoOfSit","totalReservedSit":{$size:"$occupiedSitNo"}}
  },
  {
    $sort:{"totalReservedSit":-1}
  }
    //filter by year in future
// {
//   $group:{_id:{"year":"$year"}}
//   },
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};


//get all group sale on user
exports.getTotalLocalSale = async (req, res, next) => {
  try{
  const dayY={ $dayOfYear:"$passangerInfo.bookedAt"}
  const week={ $week:"$passangerInfo.bookedAt"}
  const month={ $month:"$passangerInfo.bookedAt"}
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const day = moment('2022-12-02').month();
  const sort="months"
  let filter1
  filter1=sort=="days"?{"day":dayY}:filter1
  filter1=sort=="weeks"?{"week":week}:filter1
  filter1=sort=="months"?{"month":month}:filter1
  let filter2
  filter2=sort=="days"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="weeks"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="months"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3
  filter3=sort=="days"?{"year":"$year","day":"$day"}:filter3
  filter3=sort=="weeks"?{"year":"$year","week":"$week"}:filter3
  filter3=sort=="months"?{"year":"$year","month":"$month"}:filter3
 
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
  {
$lookup:{
  from:'users',
  foreignField:"_id",
  localField:"passangerInfo.bookedBy",
  as:"user"
}
},
{
  $project:{"_id":0,"createdAt":1,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$occupiedSitNo"}}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","totalTicket":1
  }
}
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};
exports.getTotalAgentSale = async (req, res, next) => {
  try{
  const dayY={ $dayOfYear:"$passangerInfo.bookedAt"}
  const week={ $week:"$passangerInfo.bookedAt"}
  const month={ $month:"$passangerInfo.bookedAt"}
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const day = moment('2022-12-02').month();
  const sort="months"
  let filter1
  filter1=sort=="days"?{"day":dayY}:filter1
  filter1=sort=="weeks"?{"week":week}:filter1
  filter1=sort=="months"?{"month":month}:filter1
  let filter2
  filter2=sort=="days"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="weeks"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="months"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3
  filter3=sort=="days"?{"year":"$year","day":"$day"}:filter3
  filter3=sort=="weeks"?{"year":"$year","week":"$week"}:filter3
  filter3=sort=="months"?{"year":"$year","month":"$month"}:filter3
 
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
  {
$lookup:{
  from:'users',
  foreignField:"_id",
  localField:"passangerInfo.bookedBy",
  as:"user"
}
},
{
  $project:{"_id":0,"createdAt":1,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$occupiedSitNo"}}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","totalTicket":1
  }
}
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};
exports.getTotalMobileSale = async (req, res, next) => {
  try{
  const dayY={ $dayOfYear:"$passangerInfo.bookedAt"}
  const week={ $week:"$passangerInfo.bookedAt"}
  const month={ $month:"$passangerInfo.bookedAt"}
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const day = moment('2022-12-02').month();
  const sort="months"
  let filter1
  filter1=sort=="days"?{"day":dayY}:filter1
  filter1=sort=="weeks"?{"week":week}:filter1
  filter1=sort=="months"?{"month":month}:filter1
  let filter2
  filter2=sort=="days"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="weeks"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="months"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3
  filter3=sort=="days"?{"year":"$year","day":"$day"}:filter3
  filter3=sort=="weeks"?{"year":"$year","week":"$week"}:filter3
  filter3=sort=="months"?{"year":"$year","month":"$month"}:filter3
 
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
  {
$lookup:{
  from:'users',
  foreignField:"_id",
  localField:"passangerInfo.bookedBy",
  as:"user"
}
},
{
  $project:{"_id":0,"createdAt":1,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$occupiedSitNo"}}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","totalTicket":1
  }
}
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};


//get trip history
exports.getTripHistory = async (req, res, next) => {
  try{
  const today=new Date()
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode,departureDateAndTime:{$lte:today}}
  },
    {
  $group:{
  _id:{"source":"$source","destination":"$destination"},"count":{$sum:1},"totalsitcount":{$sum:{$size:"$occupiedSitNo"}},"saleinbirr":{$sum:{$multiply:["$tarif",{$size:"$occupiedSitNo"}]}}
}
},
{
 $project:{"_id":0,"source":"$_id.source","destination":"$_id.destination","total":"$count","salesbirr":"$saleinbirr","totalreservedsit":"$totalsitcount"}
},
{
  $sort:{
    "total":-1
  }
}
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};

//bus history info avg sit and other
exports.getBusRouteHistory = async (req, res, next) => {
  try{
  const today=new Date()
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode,departureDateAndTime:{$lte:today}}
  },
    {
 $group:{
  _id:{"busid":"$assignedBus","source":"$source","destination":"$destination"},"count":{$sum:1},"averagSit":{$avg:{$size:"$occupiedSitNo"}}}
    },
    {
    $lookup:{
     from:'buses',
     foreignField:"_id",
     localField:"_id.busid",
     as:"businfo"
      }
    },
     {
      $project:{"_id":0,"source":"$_id.source","destination":"$_id.destination","total":"$count","avgsit":"$averagSit","busplate":{$arrayElemAt:["$businfo.busPlateNo",0]},"busSideno":{$arrayElemAt:["$businfo.busSideNo",0]},"serviceyear":{$arrayElemAt:["$businfo.serviceYear",0]},"currentbusstate":{$arrayElemAt:["$businfo.busState",0]}}
    },
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};
//saled ticket by mobile
exports.getTicketByMobile = async (req, res, next) => {
  try{
  const today=new Date()
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
  {
  $match:{organizationCode:orgcode,departureDateAndTime:{$lte:today}}
  },
  {
  $unwind:"$passangerInfo"
  },
  {
  $match:{"user.isMobileUser":true}
  },
  {
$group:{
    _id:{"source":"$source","destination":"$destination"},"count":{$sum:1},"saleinbirr":{$sum:"$tarif"}
    }
},
  {
    $project:{"_id":0,"source":"$_id.source","destination":"$_id.destination","total":"$count","totalsalebirr":"$saleinbirr"}
  },
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};
//all trip info
exports.getAllTripinfo = async (req, res, next) => {
  try{
  const today=new Date()
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode,departureDateAndTime:{$lte:today}}
  },
    {
 $group:{
     _id:null,"totalsit":{$sum:{$size:"$occupiedSitNo"}},"totaltrip":{$sum:1},"totalpassanger":{$sum:{$size:"$occupiedSitNo"}},"totalsale":{$sum:{$multiply:["$tarif",{$size:"$occupiedSitNo"}]}}}
  },
  {
    $project:{"_id":0,"totalreservedsit":"$totalsit","totaltrip":"$totaltrip","totalsaleinbirr":"$totalsale","totalpassanger":"$totalpassanger"}
  },
  ] )
  return res.json(allSchedule)
}
catch(error) {
  next(error)
  }
};


//total sale in birr by person
//total sale of all person in birr
//total ticket of all user and route
//totl ticket in given route all user
//cancled by so and dest
//cancled ticket all
//transd...

//between dates
exports.getAllMySaleBetween = async (req, res, next) => {
  try {
    const start = req.params.start
    const end=!!req.params.end ? req.params.end : ''
    let skip = pagesize * page
  const orgcode =req.userinfo.organization_code;
  const saler_id =req.userinfo.sub;
  const role_type=req.userinfo.user_role;
  const allSchedule= await Schedule.find({organizationCode:orgcode,userRole:role_type,"passangerInfo.bookedBy":saler_id})
  const all_my_sale=allSchedule.map(eachdoc=> 
    {
      return {source:eachdoc.source,destination:eachdoc.destination,tarif:eachdoc.tarif,departureDate:eachdoc.departureDate,departurePlace:eachdoc.departurePlace,passInfo:y.passInfo.filter(filterpassanger=>{return filterpassanger.bookedby===role_type})}})
  return res.json(all_my_sale)
  }
  catch(error) {
  next(error)
  }
};
//get calceled route
exports.getAllCanceledSchedule = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 20
    let skip = pagesize * page
  const orgcode =req.userinfo.organization_code;
  const allCanceledSchedule= await Schedule.find({organizationCode:orgcode,isCanceled:true}).limit(pagesize).skip(skip).sort({datefield:-1})
  return res.json(allCanceledSchedule)
  }
  catch(error) {
  next(error)
  }
};
//get all active schedule
exports.getAllActiveSchedule = async (req, res, next) => {
  try {
    
  const orgcode =req.params.organizationcode;
  const timenow=new Date();
  const allSchedule= await Schedule.find({organizationCode:orgcode,isCanceled:false,departureTDateAndTime:{$gte:timenow}}).sort({datefield:-1})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//compare time and show only future schedule dep.date
exports.getAllActiveScheduleInRoute = async (req, res, next) => {
  try {
  const orgcode =req.params.organizationcode;
  const timenow=new Date();
  const source=req.query.source;
  const destination=req.query.destination;
  const allSchedule= await Schedule.find({organizationCode:orgcode,source:source,destination:destination,isCanceled:false,departureDate:{$gte:timenow}})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//for mobile userinfo only
exports.getAllActiveScheduleInRouteForMobileUser = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 12
    let skip = pagesize * page

    const source=req.query.source;
    const destination=req.query.destination;
    const orgcode =req.query.organizationcode;
    if(!!source && !!destination)
    {
      const error=new Error("please fill all required field")
      error.statusCode=400
      throw error
    }
    const conditions=[]
    if (orgcode.toLowerCase()!=="all") {
      conditions.push({ organizationCode:orgcode});
  }
  const timenow=new Date();
  conditions.push({source:source,destination:destination,isCanceled:false,departureDate:{$gte:timenow}})
  const final_condtion={$and:conditions}
 
  const allSchedule= await Schedule.find(final_condtion).limit(pagesize).skip(skip).sort({datefield:-1})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};

//My booking
exports.myBookedTicketList = async (req, res, next) => {
  try {
  //selecte the field in all api
  let page = !!req.query.pageno ? req.query.pageno : 0
  let pagesize = 10
  let skip = pagesize * page

   const id=req.params.id
   const user_id=req.userinfo.sub
   const my_booking=await Schedule.find({"passangerInfo.bookedBy":user_id}).limit(pagesize).skip(skip).sort({datefield:-1})
   res.json(my_booking)
  }
  catch(error) {
    next(error)
  }
};
//My passanger for driver
// can be accessed by driver
exports.myPassangerList = async (req, res, next) => {
  try {
   const username=req.userinfo.phone_number;
   const addHour=2;
   const timenow = moment(Date.now()).add(addHour,'h')
   const my_booking=await Schedule.findOne({driverUserName:username,departureDate:{$lte:timenow}}).sort({datefield:-1})
   res.json(my_booking)
  }
  catch(error) {
    next(error)
  }
};
// get postponed passanger
exports.getPostponedPassangerList= async (req, res, next) => {
  try {
   const pass=await Schedule.find({isPassangerPostponed:true}).sort({datefield:-1})
   res.json(pass)
  }
  catch(error) {
    next(error)
  }
};
// get postponed passanger
exports.getTransferdPassangerList= async (req, res, next) => {
  try {
   const pass=await Schedule.find({isPassangerTransfered:true}).sort({datefield:-1})
   res.json(pass)
  }
  catch(error) {
    next(error)
  }
};
