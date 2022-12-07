const User = require("../models/user.model");
const Schedule = require("../models/schedule.model");
const mongoose = require("mongoose");
const moment=require("moment")
const dayY={ $dayOfYear:"$passangerInfo.bookedAt"}
const dayM={ $dayOfMonth:"$passangerInfo.bookedAt"}
const dayW={ $dayOfWeek:"$passangerInfo.bookedAt"}
const week={ $week:"$passangerInfo.bookedAt"}
const month={ $month:"$passangerInfo.bookedAt"}
const {
  GraphQLDate,
  GraphQLDateTime,
  GraphQLTime
} = require("graphql-scalars");
const { errorHandler } = require("./gqlerrorHandler");

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
        let currentWeek=moment(now).weeks()-1;
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
        $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
        "year":{$year:"$passangerInfo.bookedAt"},...filter1,
        "userRole":{$arrayElemAt:["$user.userRole",0]}}
      },
      {
        $match:{"userRole":{$nin:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
        "isMobileUser":false,...filter2}
      },
      {
        $group:{_id:filter3,"totalTicket":{$sum:1}}
      },
      {
        $project:{
          "_id":0,"year":"$_id.year","totalTicket":1
        }
      },
        ] )
        console.log(allSchedule)
        return (allSchedule[0]||null)

      }
    
      catch(error) {
        return errorHandler
        }
    },
    getLocalSpecificTotalSale:async(parent,args,context)=>{
      try{
      const now=new Date()
      let currentYear=now.getFullYear()
      let currentMonth=moment(now).month()+1;
      let currentWeek=moment(now).weeks()-1;
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
      const sales=context.sub
      const sales_id=mongoose.Types.ObjectId(sales)
      const allSchedule= await Schedule.aggregate( [
    {
        $match:{organizationCode:orgcode}
    },
    {
      $unwind:"$passangerInfo"
    },
    {
      $match:{"passangerInfo.bookedBy":sales_id}
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
      $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
      "year":{$year:"$passangerInfo.bookedAt"},...filter1,
      "userRole":{$arrayElemAt:["$user.userRole",0]}}
    },
    {
      $match:{"userRole":{$nin:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
      "isMobileUser":false,...filter2}
    },
    {
      $group:{_id:filter3,"totalTicket":{$sum:1}}
    },
    {
      $project:{
        "_id":0,"year":"$_id.year","totalTicket":1
      }
    },
      ] )
      return (allSchedule[0]||null)

    }
  
    catch(error) {
      return errorHandler
    }
  },
  getAgenTotalTicket:async(parent,args,context)=>{
    try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
    const user=await User.findById(context.sub)
    const agent_id=mongoose.Types.ObjectId(user.agentId)
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
    $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
    "userRole":{$arrayElemAt:["$user.userRole",0]},
    "agentId":{$arrayElemAt:["$user.agentId",0]}}
  },
  {
    $match:{"agentId":agent_id,"userRole":{$in:[process.env.CASHERAGENT,
      process.env.SUPERAGENT]},...filter2}
  },
  {
    $group:{_id:filter3,"totalTicket":{$sum:1}}
  },
  {
    $project:{
      "_id":0,"year":"$_id.year","totalTicket":1
    }
  },
    ] )
    return (allSchedule[0]||null)

  }
  catch(error) {
    return errorHandler
  }
},
  getLocalSpecificCanceledSale:async(parent,args,context)=>{
    try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
    const sales=context.sub
    const sales_id=mongoose.Types.ObjectId(sales)
    const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode}
  },
  {
    $unwind:"$passangerInfo"
  },
  {
    $match:{"passangerInfo.isTicketRefunded":true,"passangerInfo.canceledBy":sales_id}
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
    $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
    "userRole":{$arrayElemAt:["$user.userRole",0]}}
  },
  {
    $match:{"userRole":{$nin:[process.env.CASHERAGENT,
      process.env.SUPERAGENT]},...filter2}
  },
  {
    $group:{_id:filter3,"totalTicket":{$sum:1}}
  },
  {
    $project:{
      "_id":0,"year":"$_id.year","totalTicket":1
    }
  },
    ] )
    return (allSchedule[0]||null)

  }

  catch(error) {
    return errorHandler
  }
},
//canceled by agent
getAgentCanceledTicket:async(parent,args,context)=>{
  try{
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  const user=await User.findById(context.sub)
  const agent_id=mongoose.Types.ObjectId(user.agentId)
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
{
  $match:{"passangerInfo.isTicketRefunded":true,}
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
  $project:{"_id":0,"agentId":{$arrayElemAt:["$user.agentId",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"agentId":agent_id,"userRole":{$in:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:1}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","totalTicket":1
  }
},
  ] )
  return allSchedule

}

catch(error) {
  return errorHandler
}
},
getAgentTotalSale:async(parent,args,context)=>{
      try{
      const now=new Date()
      let currentYear=now.getFullYear()
      let currentMonth=moment(now).month()+1;
      let currentWeek=moment(now).weeks()-1;
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
      $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
      "year":{$year:"$passangerInfo.bookedAt"},...filter1,
      "userRole":{$arrayElemAt:["$user.userRole",0]}}
    },
    {
      $match:{"userRole":{$in:[process.env.CASHERAGENT,
        process.env.SUPERAGENT]},"isMobileUser":false,...filter2}
    },
    {
      $group:{_id:filter3,"totalTicket":{$sum:1}}
    },
    {
      $project:{
        "_id":0,"year":"$_id.year","totalTicket":1
      }
    }
      ] )
      return (allSchedule[0]||null)

    }
  
    catch(error) {
      return errorHandler
    }
  },

  getMobileTotalSale:async(parent,args,context)=>{
    try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
    $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
    "year":{$year:"$passangerInfo.bookedAt"},...filter1,
    "userRole":{$arrayElemAt:["$user.userRole",0]}}
  },
  {
    $match:{"isMobileUser":true,...filter2}
  },
  {
    $group:{_id:filter3,"totalTicket":{$sum:1}}
  },
  {
    $project:{
      "_id":0,"year":"$_id.year","totalTicket":1
    }
  }
    ] )
    return (allSchedule[0]||null)

  }
  catch(error) {
    return errorHandler
  }
},
getTotalSale:async(parent,args,context)=>{
  try{
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:1}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","totalTicket":1
  }
}
  ] )
  return (allSchedule[0]||null)

}
catch(error) {
  return errorHandler
}
},
//donut
getEachAgentSale:async(parent,args,context)=>{
  try{
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  filter3=sort=="day"?{"year":"$year","day":"$day","agent":"$agentId"}:filter3
  filter3=sort=="week"?{"year":"$year","week":"$week","agent":"$agentId"}:filter3
  filter3=sort=="month"?{"year":"$year","month":"$month","agent":"$agentId"}:filter3
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
  $project:{"_id":0,"agentId":{$arrayElemAt:["$user.agentId",0]},
  "userID":{$arrayElemAt:["$user._id",0]},
  "isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:1},"agentId":{$first:"$agentId"}}
},
{
  $lookup:{
    from:'agents',
    foreignField:"_id",
    localField:"agentId",
    as:"agent"
  }
  },
{
  $project:{
      totalTicket:1,"agentName":{$arrayElemAt:["$agent.agentName",0]}
    }
  
}
  ] )
  console.log("valauejsfaksd")
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  console.log(error)
  return errorHandler
}
},
//donut agent
getOneAgentSale:async(parent,args,context)=>{
  try{
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const user=await User.findById(context.sub)
  const agent_id=mongoose.Types.ObjectId(user.agentId)
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
  $project:{"_id":0,"casherName":{$arrayElemAt:["$user.firstName",0]},
  "agentId":{$arrayElemAt:["$user.agentId",0]},
  "userID":{$arrayElemAt:["$user._id",0]},
  "isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},"agentId":agent_id,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:1},
  "agentName":{$first:"$casherName"}}
},

  ] )

  return allSchedule

}
catch(error) {
  return errorHandler
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},
  "month":{$month:"$passangerInfo.bookedAt"},
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},"isMobileUser":false}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:1}}
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
  return errorHandler
}
},
getAgentTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  const user=await User.findById(context.sub)
  const agent_id=mongoose.Types.ObjectId(user.agentId)
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1
  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
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
  $project:{"_id":0,"agentId":{$arrayElemAt:["$user.agentId",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "agentId":agent_id,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}


  ] )
  console.log("agent sale in birr")
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  return errorHandler
}
},
//birr
getGroupAgentTicketInbr:async(parent,args,context)=>{
  try{
  const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
  //just to pass the label argument not to group
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  // const orgcode =context.organization_code;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}


  ] )
  return allSchedule

}
catch(error) {
  return errorHandler
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"month":{$month:"$passangerInfo.bookedAt"},
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":{$nin:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "isMobileUser":false}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:1}}
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
  return errorHandler
}
},
//birr year large
getGroupLocalTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"userRole":{$nin:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}
  ] )
  return allSchedule

}
catch(error) {
  return errorHandler
}
},
//specific cashersale in birr
getCasherTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  console.log("check point")
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const booker_id=mongoose.Types.ObjectId(context.sub)
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
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
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
  $project:{"_id":0,"bookedBy":"$passangerInfo.bookedBy",
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,"price":"$tarif"}
},
{
  $match:{"bookedBy":booker_id,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}
  ] )
  return allSchedule

}
catch(error) {
  return errorHandler
}
},
getGroupLocalSpecfcificTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const sales=context.sub
  const sales_id=mongoose.Types.ObjectId(sales)
  const sort=args.input.filter
  console.log(sort)
  let filter1
  filter1=sort=="day"?{"day":dayY}:filter1
  filter1=sort=="week"?{"week":week,"day":dayW}:filter1
  filter1=sort=="month"?{"month":month,"day":dayM}:filter1
  filter1=sort=="year"?{"month":month,"day":dayY}:filter1

  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let filter3={"year":"$year"}
  filter3=sort=="day"?  {"day":"$day"}:filter3
  filter3=sort=="week"?  {"week":"$week"}:filter3
  filter3=sort=="month"?  {"month":"$month"}:filter3

  const orgcode =context.organization_code;
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
{
  $match:{"passangerInfo.bookedBy":sales_id}
},
{
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "price":"$tarif"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"totalPrice":1
  }
},
  ] )
return allSchedule
}
catch(error) {
  return errorHandler
}
},
//for canceled
getGroupLocalSpecfcificCanceledTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const sales=context.sub
  const sales_id=mongoose.Types.ObjectId(sales)
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
  let filter3={"year":"$year"}
  filter3=sort=="day"?  {"day":"$day"}:filter3
  filter3=sort=="week"?  {"week":"$week"}:filter3
  filter3=sort=="month"?  {"month":"$month"}:filter3
  const orgcode =context.organization_code;
  console.log(sales_id)
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
{
  $match:{"passangerInfo.isTicketRefunded":true,"passangerInfo.canceledBy":sales_id}
},
{
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "price":"$tarif"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"totalPrice":1
  }
},
  ] )
return allSchedule
}
catch(error) {
  return errorHandler
}
},
getAgentCanceledTicketBirr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
  const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const user=await User.findById(context.sub)
  const agent_id=mongoose.Types.ObjectId(user.agentId)
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
  let filter3={"year":"$year"}
  filter3=sort=="day"?  {"day":"$day"}:filter3
  filter3=sort=="week"?  {"week":"$week"}:filter3
  filter3=sort=="month"?  {"month":"$month"}:filter3
  const orgcode =context.organization_code;
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode}
},
{
  $unwind:"$passangerInfo"
},
{
  $match:{"passangerInfo.isTicketRefunded":true}
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
  $project:{"_id":0,"userRole":{$arrayElemAt:["$user.userRole",0]},
  "agentId":{$arrayElemAt:["$user.agentId",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,"price":"$tarif"}
},
{
  $match:{"agentId":agent_id,"userRole":{$in:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"totalPrice":1
  }
},
  ] )

return allSchedule
}
catch(error) {
  return errorHandler
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},
  "month":{$month:"$passangerInfo.bookedAt"},
  "userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"isMobileUser":true}
},
{
  $group:{_id:{"year":"$year","month":"$month"},"totalTicket":{$sum:1}}
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
  return errorHandler
}
},
//birr
getGroupMobileTicketInbr:async(parent,args,context)=>{
  try{
 // const orgcode ='001000';
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]}
  ,"year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}

  ] )
  return allSchedule

}
catch(error) {
  return errorHandler
}
},
//bus sit reserve report
getAggregateSitReserve:async(parent,args,context)=>{
  try{
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  
  let filter1={"year":currentYear}
  filter1=sort=="day"?{"year":currentYear,"day":today}:filter1
  filter1=sort=="week"?{"year":currentYear,"week":currentWeek}:filter1
  filter1=sort=="month"?{"year":currentYear,"month":currentMonth}:filter1
  let group1={"year":"$year"}
  group1=sort=="day"?{"year":"$year","day":"$day"}:group1
  group1=sort=="week"?{"year":"$year","week":"$week"}:group1
  group1=sort=="month"?{"year":"$year","month":"$month"}:group1
  // let filter31={"label":{$first:"$day"}}
  // filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
  
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode,departureDateAndTime:{$lt:now}}
},
{
  $project:{totalNoOfSit:1,"occupiedSit":{$size:"$occupiedSitNo"},departureDateAndTime:1,
   openSit:{$subtract:["$totalNoOfSit",{$size:"$occupiedSitNo"}]} ,"year":{$year:"$departureDateAndTime"},"month":{$month:"$departureDateAndTime"},
    "week":{$week:"$departureDateAndTime"},"day":{$dayOfYear:"$departureDateAndTime"}}
},
{
  $match:{...filter1}
},
{
  $group:{_id:group1,"avgOpenSit":{$avg:"$openSit"},
  "avgReservedSit":{$avg:"$occupiedSit"}}
},
{
  $project:{
    "_id":0,"avgOpenSit":1,"avgReservedSit":1
  }
},
  ] )
  return (allSchedule[0]||null)
}
catch(error) {
  return errorHandler
}
},

getRouteAggregateSitReserve:async(parent,args,context)=>{
  try{
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  const sort=args.input.filter
  let filter1
  filter1=sort=="day"?{"day":{$dayOfYear:"$departureDateAndTime"}}:filter1
  filter1=sort=="week"?{"week":{$week:"$departureDateAndTime"},"day":{$dayOfWeek:"$departureDateAndTime"}}:filter1
  filter1=sort=="month"?{"month":{$month:"$departureDateAndTime"},"day":{$dayOfMonth:"$departureDateAndTime"}}:filter1
  filter1=sort=="year"?{"month":{$month:"$departureDateAndTime"},"day":{$dayOfYear:"$departureDateAndTime"}}:filter1
  let filter2={"year":currentYear}
  filter2=sort=="day"?{"year":currentYear,"day":today}:filter2
  filter2=sort=="week"?{"year":currentYear,"week":currentWeek}:filter2
  filter2=sort=="month"?{"year":currentYear,"month":currentMonth}:filter2
  let group1={"year":"$year","source":"$source","destination":"$destination"}
  group1=sort=="day"?{...group1,"day":"$day"}:group1
  group1=sort=="week"?{...group1,"week":"$week"}:group1
  group1=sort=="month"?{...group1,"month":"$month"}:group1
  let filter31={"label":{$first:"$day"}}
  filter31=sort=="year"?{"label":{$first:"$month"}}:filter31
  const orgcode =context.organization_code;
  // const orgcode="001000"
  
  const allSchedule= await Schedule.aggregate( [
{
    $match:{organizationCode:orgcode,departureDateAndTime:{$lt:now}}
},
{
  $project:{totalNoOfSit:1,source:1,destination:1,
    "year":{$year:"$departureDateAndTime"},
    "occupiedSit":{$size:"$occupiedSitNo"},departureDateAndTime:1,
     openSit:{$subtract:["$totalNoOfSit",{$size:"$occupiedSitNo"}]},...filter1}
},
{
  $match:{...filter2}
},
{
  $group:{_id:group1,"avgOpenSit":{$avg:"$openSit"},
  "avgReservedSit":{$avg:"$occupiedSit"},
  "source":{$first:"$source"},"destination":{$first:"$destination"},...filter31}
},
{
  $project:{
    "_id":0,"avgOpenSit":1,"avgReservedSit":1,"source":1,"destination":1,"label":1
  }
},
  ] )
  console.log(allSchedule)
  return (allSchedule)
}
catch(error) {
  console.log(error)
  return errorHandler
}
},
//sale map in br
//cancel
getDaysAgentTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]}
  ,"year":{$year:"$passangerInfo.bookedAt"},
  "day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},
  "price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
  "isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
  "totalPrice":{$sum:"$price"}}
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
  return errorHandler
}
},
//sale map in br
//cancel
getDaysLocalTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},
  "price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":{$nin:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},
  "bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
  return errorHandler
}
},
//sale map in br
getDaysInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
  const AgentTicket= await Schedule.aggregate( [
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
  "bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":{$in:[process.env.CASHERAGENT,
    process.env.SUPERAGENT]},"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},
  "bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
},
{
  $sort:{"bookedAt":1}
}

  ] )
    
  const MobileTicket= await Schedule.aggregate( [
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
  "bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
  "totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
},
{
  $sort:{"bookedAt":1}
}

  ] )

const AllTicket= await Schedule.aggregate( [
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
$project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
"bookedAt":"$passangerInfo.bookedAt"}
},
{
$match:{...filter2}
},
{
$group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
"totalPrice":{$sum:"$price"}}
},
{
$project:{
  "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
}
},
{
  $sort:{"bookedAt":1}
}
] )
const LocalTicket= await Schedule.aggregate( [
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
$project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
"bookedAt":"$passangerInfo.bookedAt"}
},
{
$match:{"userRole":{$nin:[process.env.CASHERAGENT,process.env.SUPERAGENT]},
"isMobileUser":false,...filter2}
},
{
$group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
"totalPrice":{$sum:"$price"}}
},
{
$project:{
"_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
}
},
{
  $sort:{"bookedAt":1}
}

] )

  return ([{LocalTicket},{AgentTicket},{MobileTicket},{AllTicket}])

}
catch(error) {
  return errorHandler
}
},
//
getDaysMobileTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
    let today =moment(now).dayOfYear();
    const sort=args.input.filternvm
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
  "bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
  "totalPrice":{$sum:"$price"}}
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
  return errorHandler
}
},

//large graph all in br
getGroupAllTicketInbr:async(parent,args,context)=>{
  try{
  // const orgcode ='001000';
 const now=new Date()
  let currentYear=now.getFullYear()
  let currentMonth=moment(now).month()+1;
  let currentWeek=moment(now).weeks()-1;
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
  let filter3={"year":"$year","day":"$day"}
  filter3=sort=="year"?  {"year":"$year","month":"$month"}:filter3
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:filter3,"totalPrice":{$sum:"$price"},...filter31}
},
{
  $project:{
    "_id":0,"label":1,"totalPrice":1
  }
},
{
  $sort:{"label":1}
}
  ] )
  return allSchedule

}
catch(error) {
  return errorHandler
}
},
//all sales
//sale map in br
//cancel
getDaysAllTicketInbr:async(parent,args,context)=>{
  try{
    const now=new Date()
    let currentYear=now.getFullYear()
    let currentMonth=moment(now).month()+1;
    let currentWeek=moment(now).weeks()-1;
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},
  "year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,
  "userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif",
  "bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},
  "totalPrice":{$sum:"$price"}}
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
  return errorHandler
    }
   },
 },
}

module.exports=resolvers
