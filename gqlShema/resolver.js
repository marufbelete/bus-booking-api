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
        $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
      },
      {
        $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
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
        return allSchedule[0]

      }
    
      catch(error) {
        return []
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
      const sales=context.sub
      const sales_id=mongoose.Types.ObjectId(sales)
      console.log(sales_id)
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
      $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
    },
    {
      $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
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
      return allSchedule[0]

    }
  
    catch(error) {
      return []
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
    console.log(sales_id)
    const allSchedule= await Schedule.aggregate( [
  {
      $match:{organizationCode:orgcode}
  },
  {
    $unwind:"$passangerInfo"
  },
  {
    $match:{"passangerInfo.isTiacketCanceled":true,"passangerInfo.canceledBy":sales_id}
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
    $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
  },
  {
    $match:{"userRole":{$ne:process.env.AGENT},...filter2}
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
    console.log("test")
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
      $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
    },
    {
      $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
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
    $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
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
    return allSchedule[0]

  }
  catch(error) {
    return []
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
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
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
  console.log(allSchedule[0])
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
  $project:{"_id":0,"agentName":{$arrayElemAt:["$user.firstName",0]},"userID":{$arrayElemAt:["$user._id",0]},"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:filter3,"totalTicket":{$sum:1},"agentName":{$first:"$agentName"}}
},
{
  $project:{ "_id":0,"totalTicket":1,"agentName":1 }
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"month":{$month:"$passangerInfo.bookedAt"},"userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"month":{$month:"$passangerInfo.bookedAt"},"userRole":{$arrayElemAt:["$user.userRole",0]}}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false}
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
  let currentWeek=moment(now).weeks()-1;
  let today =moment(now).dayOfYear();
  console.log(currentWeek)
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
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
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  console.log(error)
  return []
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
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,"price":"$tarif"}
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
  console.log(error)
  return []
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
  $match:{"passangerInfo.isTiacketCanceled":true,"passangerInfo.canceledBy":sales_id}
},
{
  $project:{"_id":0,"year":{$year:"$passangerInfo.bookedAt"},...filter1,"price":"$tarif"}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"month":{$month:"$passangerInfo.bookedAt"},"userRole":{$arrayElemAt:["$user.userRole",0]}}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
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
  return []
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
},
{
  $project:{
    "_id":0,"year":"$_id.year","bookedAt":1,"totalPrice":1
  }
}

  ] )
  console.log(allSchedule)
  return allSchedule

}
catch(error) {
  console.log(error)
  return []
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"userRole":process.env.AGENT,"isMobileUser":false,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
$project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
$match:{...filter2}
},
{
$group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
$project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
$match:{"userRole":{$ne:process.env.AGENT},"isMobileUser":false,...filter2}
},
{
$group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
  return []
  }
},
//cancel
getDaysMobileTicketInbr:async(parent,args,context)=>{
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{"isMobileUser":true,...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif"}
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
  console.log(error)
  return []
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
  $project:{"_id":0,"isMobileUser":{$arrayElemAt:["$user.isMobileUser",0]},"year":{$year:"$passangerInfo.bookedAt"},"day":dayY,...filter1,"userRole":{$arrayElemAt:["$user.userRole",0]},"price":"$tarif","bookedAt":"$passangerInfo.bookedAt"}
},
{
  $match:{...filter2}
},
{
  $group:{_id:{"year":"$year","day":"$day"},"bookedAt":{$first:"$bookedAt"},"totalPrice":{$sum:"$price"}}
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
