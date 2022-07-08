const User = require("../models/user.model");
const Schedule = require("../models/schedule.model");
const moment=require("moment")
const dayY={ $dayOfYear:"$createdAt"}
const dayM={ $dayOfMonth:"$createdAt"}
const dayW={ $dayOfWeek:"$createdAt"}
const week={ $week:"$createdAt"}
const month={ $month:"$createdAt"}
const {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} = require("graphql-scalars");

const resolvers={
  Date: GraphQLDate,
  Time: GraphQLTime,
  DateTime: GraphQLDateTime,
Query:{
    getLocalTotalSale:async(parent,args,context)=>{
        try{
        const now=new Date()
        let currentYear=now.getFullYear()
        let currentMonth=moment(now).month()+1;
        let currentWeek=moment(now).week();
        let today =moment(now).dayOfYear();
        const sort=args.input.filter
        console.log(sort)
        let filter1
        filter1=sort=="day"?{"day":dayY}:filter1
        filter1=sort=="week"?{"week":week}:filter1
        filter1=sort=="month"?{"month":month}:filter1
        let filter2={"year":currentYear}
        filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
        filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
        filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
        let filter3={"year":"$year"}
        filter3=sort=="day"?{"year":"$year","day":"$day"}:filter3
        filter3=sort=="week"?{"year":"$year","week":"$week"}:filter3
        filter3=sort=="month"?{"year":"$year","month":"$month"}:filter3
        const orgcode =context.organization_code;
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
        $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
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
      },
        ] )
        console.log(allSchedule)
        return allSchedule[0]

      }
    
      catch(error) {
        return []
        }
    },

    getAgentTotalSale:async(parent,args,context)=>{
      try{
      const now=new Date()
      let currentYear=now.getFullYear()
      let currentMonth=moment(now).month()+1;
      let currentWeek=moment(now).week();
      let today =moment(now).dayOfYear();
      const sort=args.input.filter
      let filter1
      filter1=sort=="day"?{"day":dayY}:filter1
      filter1=sort=="week"?{"week":week}:filter1
      filter1=sort=="month"?{"month":month}:filter1
      let filter2={"year":currentYear}
      filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
      filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
      filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
      let filter3={"year":"$year"}
      filter3=sort=="day"?{"year":"$year","day":"$day"}:filter3
      filter3=sort=="week"?{"year":"$year","week":"$week"}:filter3
      filter3=sort=="month"?{"year":"$year","month":"$month"}:filter3
      const orgcode =context.organization_code;
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
      $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
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
      return allSchedule[0]

    }
  
    catch(error) {
      return []
      }
  },

  getMobileTotalSale:async(parent,args,context)=>{
    try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).week();
    let today =moment(now).dayOfYear();
    const sort=args.input.filter
    let filter1
    filter1=sort=="day"?{"day":dayY}:filter1
    filter1=sort=="week"?{"week":week}:filter1
    filter1=sort=="month"?{"month":month}:filter1
    let filter2={"year":currentYear}
    filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
    filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
    filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
    let filter3={"year":"$year"}
    filter3=sort=="day"?{"year":"$year","day":"$day"}:filter3
    filter3=sort=="week"?{"year":"$year","week":"$week"}:filter3
    filter3=sort=="month"?{"year":"$year","month":"$month"}:filter3
    const orgcode =context.organization_code;
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
    $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
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
    return allSchedule[0]

  }
  catch(error) {
    return []
    }
},

//donut
getEachAgentSale:async(parent,args,context)=>{
  try{
  const now=new Date()
  console.log("startausdkjasbdfasjk")
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week}:filter1
  filter1=sort=="month"?{"month":month}:filter1
  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","agent":"$userID"}
  filter3=sort=="day"?{"year":"$year","day":"$day","agent":"$userID"}:filter3
  filter3=sort=="week"?{"year":"$year","week":"$week","agent":"$userID"}:filter3
  filter3=sort=="month"?{"year":"$year","month":"$month","agent":"$userID"}:filter3
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"agentName":"$user.firstName","userID":"user._id","isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:"$totalTicket"},"agentName":{$first:"$$agentName"}}
},
{
  $project:{
    "_id":0,"totalTicket":1,"agentName":1
  }
}

  ] )
  console.log("valauejsfaksd")
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  console.log(error)
  return []
  }
},
//monthly comparsion
//agent ticket month
getGroupMonthAgentTicket:async(parent,args,context)=>{
  try{
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"month":{$month:"$createdAt"},"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","month":"$_id.month","totalTicket":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},
//birr
getGroupAgentTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1

  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","day":"$day","agent":"$userID"}
  filter3=sort=="year"?  {"year":"$year","month":"$month","agent":"$userID"}:filter3
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif"}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:{$multiply:["$totalTicket","$price"]}},...filter31}
},
{
  $project:{
    "_id":0,"lable":1,"totalPrice":1
  }
},
{
  $sort:{"lable":1}
}


  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},


//local ticket month
getGroupMonthLocalTicket:async(parent,args,context)=>{
  try{
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"month":{$month:"$createdAt"},"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","month":"$_id.month","totalTicket":1
  }
}

  ] )
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  return []
  }
},
//birr year large
getGroupLocalTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1

  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","day":"$day","agent":"$userID"}
  filter3=sort=="year"?  {"year":"$year","month":"$month","agent":"$userID"}:filter3
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif"}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:{$multiply:["$totalTicket","$price"]}},...filter31}
},
{
  $project:{
    "_id":0,"lable":1,"totalPrice":1
  }
},
{
  $sort:{"lable":1}
}
  ] )
  return allSchedule

}
catch(error) {
  console.log(error)
  return []
  }
},
//Mobile ticket month
getGroupMonthMobileTicket:async(parent,args,context)=>{
  try{
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"month":{$month:"$createdAt"},"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"}}
},
{
  $match:{"isMobileUser":true}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:"$totalTicket"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","month":"$_id.month","totalTicket":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},
//birr
getGroupMobileTicketInbr:async(parent,args,context)=>{
  try{
 // const orgcode ='001000';
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1

  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","day":"$day","agent":"$userID"}
  filter3=sort=="year"?  {"year":"$year","month":"$month","agent":"$userID"}:filter3
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:{$multiply:["$totalTicket","$price"]}},...filter31}
},
{
  $project:{
    "_id":0,"lable":1,"totalPrice":1
  }
},
{
  $sort:{"lable":1}
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},

//sale map in br
getDaysAgentTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).week();
    let today =moment(now).dayOfYear();
    const sort=args.input.filter
    let filter1
    filter1=sort=="week"?{"week":week}:filter1
    filter1=sort=="month"?{"month":month}:filter1
    let filter2={"year":currentYear}
    filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
    filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
    filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
    const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif","bookedAt":"$createdAt"}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$$bookedAt"},"totalPrice":{$sum:{$multiple:["$totalTicket","$price"]}}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},
//sale map in br
getDaysLocalTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).week();
    let today =moment(now).dayOfYear();
    const sort=args.input.filter
    let filter1
    filter1=sort=="week"?{"week":week}:filter1
    filter1=sort=="month"?{"month":month}:filter1
    let filter2={"year":currentYear}
    filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
    filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
    filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
    const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif","bookedAt":"$createdAt"}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$$bookedAt"},"totalPrice":{$sum:{$multiple:["$totalTicket","$price"]}}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},
//sale map in br
getDaysMobileTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).week();
    let today =moment(now).dayOfYear();
    const sort=args.input.filter
    let filter1
    filter1=sort=="week"?{"week":week}:filter1
    filter1=sort=="month"?{"month":month}:filter1
    let filter2={"year":currentYear}
    filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
    filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
    filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
    const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif","bookedAt":"$createdAt"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$$bookedAt"},"totalPrice":{$sum:{$multiple:["$totalTicket","$price"]}}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},

//large graph all in br
getGroupAllTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).week();
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1

  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","day":"$day","agent":"$userID"}
  filter3=sort=="year"?  {"year":"$year","month":"$month","agent":"$userID"}:filter3
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:{$multiply:["$totalTicket","$price"]}},...filter31}
},
{
  $project:{
    "_id":0,"lable":1,"totalPrice":1
  }
},
{
  $sort:{"lable":1}
}
  ] )
  return allSchedule

}
catch(error) {
  console.log(error)
  return []
  }
},
//all sales
//sale map in br
getDaysAllTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).week();
    let today =moment(now).dayOfYear();
    const sort=args.input.filter
    let filter1
    filter1=sort=="week"?{"week":week}:filter1
    filter1=sort=="month"?{"month":month}:filter1
    let filter2={"year":currentYear}
    filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
    filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
    filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
    const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$createdAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"totalTicket":{$size:"$passangerInfo.passangerOccupiedSitNo"},"price":"$tarif","bookedAt":"$createdAt"}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$$bookedAt"},"totalPrice":{$sum:{$multiple:["$totalTicket","$price"]}}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
}

  ] )
  return allSchedule

}
catch(error) {
  return []
  }
},

},
// User:{
//   async customer(parent,args) {
//     return await Customer.findOne({where:{customerID:parent.customerID}})
//     },
//     async driver(parent,args) {
//       return await User.findByPk(parent.driverAssigned)
//       },
//   async warehouse(parent,args) {
//     return await Warehouse.findOne({where:{_id:parent.hubID}})
//     },
//   },
}

module.exports=resolvers
