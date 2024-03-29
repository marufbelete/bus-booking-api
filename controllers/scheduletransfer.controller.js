const Schedule = require("../models/schedule.model");
const {sit_gene}=require("../helpers/sit_generator")
const Organization = require("../models/organization.model");
const moment=require('moment')
const Managecash = require("../models/managelocalcash.model");
const mongoose = require("mongoose");
const Manageagentcash=require("../models/manageagentcash.model");
const User = require("../models/user.model");

//transfer schedule request will send request notification to other org nothing more
// exports.scheduleTransferRequest = async (req, res, next) => {
//   try {
//    const schedule_id=req.body.scheduleid
//    //find unique socket of organization that we want to send request notification
//   //  const socket_id=req.body.scoketid
//   // io.getIo().emit({action:"transfer request",value:schedule_id})
//    return res.json({message:"request sent successfully"})
//   }
//   catch(error) {
//     next(error)
//   }
// };
// // accept transfer schedule
// exports.acceptScheduleTransferRequest = async (req, res, next) => {
//   const session=await Schedule.startSession()
//   try {
//     session.startTransaction();
//    const schedule_id=req.query.scheduleid
//    const transfer_info=await Schedule.aggregate([
//      {$match:{_id:schedule_id}},
//      {$project:{source:1,destination:1,tarif:1,passangerInfo:1,departureDateAndTime:1,numberOfPassanger:{$size:"$occupiedSitNo"},occupiedSit1:"$occupiedSitNo"},
//      }
//    ])
//    //find the intersection of the two occupied sit
//    const for_schedule_accepting =await Schedule.findOne(
//     {source:transfer_info.source,distination:transfer_info.destination,departureDateAndTime:transfer_info.departureDateAndTime,
//      $expr:{$gte:[{$subtract:["$totalNoOfSit",{$size:"$occupiedSitNo"}]},transfer_info.numberOfPassanger]}})
// let occupied1 = transfer_info.occupiedSit1;
// let occupied2 = for_schedule_accepting.occupiedSitNo;
// const intersection = occupied1.filter(element => occupied2.includes(element));
// let only_in_occupied1=occupied1.filter((elem=>!occupied2.includes(elem)))
// //generate unique number which is not in occpied2 if there is an intersection
// const generated_sit=[]
// const final_transfer_sit=[]

// if(intersection.length>0)
// {
// for (let i=0;i<intersection.length; i++)
// {
//   let sit=sit_gene(1, 49)
//   generated_sit.push(sit)
// }
//  final_transfer_sit=[...only_in_occupied1,...generated_sit]
// }
//   //transfer maping for userinfo info
//   const add_passanger_info=transfer_info.passangerInfo.map((elem)=>{
//     const each_intersection = occupied2.includes(elem.passangerOccupiedSitNo)
//     let each_pass_sit
//        if(each_intersection.includes(elem.passangerOccupiedSitNo))
//        {
//         each_pass_sit=generated_sit.splice(-1)[0]
//       }
//       else 
//       {
//         each_pass_sit=elem.passangerOccupiedSitNo
//       }
   
//     return {...elem,passangerOccupiedSitNo:each_pass_sit}
//   })
//    //find and insert to shedule which can accomodate those passanger in given date
//    //solve the sit number issue
//    const accpting_schedule_id=for_schedule_accepting._id
//    await Schedule.findByIdAndUpdate(accpting_schedule_id,
//      {
//      $set:{ passangerInfo:{$addToSet:{$each:add_passanger_info}},occupiedSitNo:[...final_transfer_sit,...occupied2]}
//      },
//      {session,new:true,useFindAndModify:false}
//      )
//    //make istransferd true
//    await Schedule.findByIdAndUpdate(schedule_id,{
//      $set:{
//       isTransfered:true,
//      }
//    },{session,new:true,useFindAndModify:false})
//    //find unique socket of organization that we want to send request notification
//    const socket_id=req.body.scoketid
//   await session.commitTransaction();
//   io.getIo().emit({action:"RequestAccepted",value:"your request is accepted by Name of the company"})
//   return res.json({message:"request sent successfully"})
//   }
//   catch(error) {
//     await session.abortTransaction();
//     next(error)
//   }
// };
// //transfer schedule request rejected
// exports.rejectScheduleTransferRequest = async (req, res, next) => {
//   try {
// io.getIo().emit({action:"RequestRejected",value:"your request isnot accepted by Name of the company"})
//  return 
//   }
//   catch(error) {
//     next(error)
//   }
// }
// //postpone trip for specific userinfo
// exports.postPoneTrip = async (req, res, next) => {
//   const session=await Schedule.startSession()
//   try {
//     const schedule_id=req.body.id
//     const source=req.body.source
//     const destination=req.body.destination
//     const passange_name=req.body.passname
//     const pass_phone_number=req.body.passphone
//     const passanger_unique_id=req.body.passangerid
//     const booked_by=req.body.bookedby
//     const total_sit_arr=req.body.reservedsit
//     const new_departure_date=req.body.newdeparturedate
//     const orgcode=req.userinfo.organization_code
  
//     const postpone_to=await Schedule.findOne({source:source,destination:destination,departureDateAndTime:new_departure_date,organizationCode:orgcode})
//     const occup_sit=postpone_to.occupiedSitNo
//     //sit not allowed
//     const sit_not_allowed=total_sit_arr.filter((elem)=>{
//       return occup_sit.includes(elem)
//     })
//     const generated_sit=[]
// //sit allowed
//     const sit_allowed=total_sit_arr.filter((elem)=>{
//       return !occup_sit.includes(elem)
//     })
//     if(intersection.length>0)
//     {
//     for (let i=0;i<sit_not_allowed.length; i++)
//     {
//       let sit=sit_gene(1, 49)
//       generated_sit.push(sit)
//     }
//   }
//   const new_allowed_sit=sit_not_allowed.map((ele)=>{
//      return generated_sit.splice(-1)[0]
//   })
//   const submit_sit=[...sit_allowed,...new_allowed_sit]
//     session.startTransaction()
//     await Schedule.findByIdAndUpdate(postpone_to._id,
//       {
//           $push:{passangerInfo:{passangerName:passange_name,
//            passangerPhone:pass_phone_number,
//            uniqueId:passanger_unique_id,
//            PassangerOccupiedSitNo:submit_sit,
//            bookedBy:booked_by}},
//            $addToSet:{occupiedSitNo:{$each:submit_sit}},
//            }
//       ,{session,new:true})
//       const change_preivious_schedule=await Schedule.findByIdAndUpdate(schedule_id,
//         {$set:{"passangerInfo.$[el].isPassangerPostponed":true}},
//         {arrayFilters:[{"el.uniqueId":passanger_unique_id}],session,new:true,useFindAndModify:false})
//        session.commitTransaction()

//  return res.json()
//   }
//   catch(error) {
//     await session.abortTransaction();
//     next(error)
//   }
// }




//canccel ticket
exports.cancelPassTicket = async (req, res, next) => {
  try {
    const schedule_id=req.params.id
    const pass_id=req.body.uniqueid
    const pass_sit=req.body.passsit
    const timenow = new Date
    const orgcode =req.userinfo.organization_code;
    const schedule=await Schedule.findById(schedule_id)
    const cancelr_id=req.userinfo.sub
    const org_rule= await Organization.findOne({organizationCode:orgcode},{rulesAndRegulation:1})
    if(schedule&&moment(schedule.departureDateAndTime).add(Number(org_rule?.rulesAndRegulation?.maxReturnDate),'d').isAfter(timenow))
    {
      const {isPassangerDeparted,isTicketRefunded,isTicketCanceled}=schedule.passangerInfo.filter(e=>e.uniqueId==pass_id)[0]
      if(isPassangerDeparted)
      {
        const error=new Error("this passanger already departed")
        error.statusCode=401
        throw error
      }
      if(isTicketRefunded)
      {
        const error=new Error("this ticket already refunded")
        error.statusCode=401
        throw error
      }
      if(isTicketCanceled)
      {
        const error=new Error("this ticket already canceled")
        error.statusCode=401
        throw error
      }

      const schedule_info=await Schedule.findById(schedule_id,{passangerInfo:1})
      if(schedule_info.passangerInfo?.filter(e=>e.uniqueId===pass_id).length==0)
      {
        const error=new Error("sit number doesn't match with passanger id")
        error.statusCode=401
        throw error
      }
    if(moment(schedule.departureDateAndTime).isAfter(timenow))
    { 
      await Schedule.findByIdAndUpdate(schedule_id,
      {$set:{"passangerInfo.$[el].isTicketCanceled":true,
      "passangerInfo.$[el].canceledBy":cancelr_id,
      "passangerInfo.$[el].sitCanceled":pass_sit},
      $pull:{occupiedSitNo: pass_sit }},
      {arrayFilters:[{"el.uniqueId":pass_id}],
      new:true,useFindAndModify:false})

    }
    else{
      await Schedule.findByIdAndUpdate(schedule_id,
      {$set:{"passangerInfo.$[el].isTicketCanceled":true,
      "passangerInfo.$[el].canceledBy":cancelr_id,
      "passangerInfo.$[el].sitCanceled":pass_sit}},
      {arrayFilters:[{"el.uniqueId":pass_id}],new:true,
      useFindAndModify:false})
    }
    return res.json({message:"refund done"})
  }
  const error=new Error("ticket refund Date Exired")
  error.statusCode=401
  throw error
  }
  catch(error) {
    next(error)
  }
}
//refund we can use for mobile too
exports.refundRequest = async (req, res, next) => {
  const session=await mongoose.startSession()
  session.startTransaction() 
  try {
    const schedule_id=req.params.id
    const pass_id=req.body.uniqueid
    const pass_sit=req.body.passsit
    const timenow = new Date
    const orgcode =req.userinfo.organization_code;
    const schedule=await Schedule.findById(schedule_id)
    const refunder_id=req.userinfo.sub
    const refunder_role=req.userinfo.user_role
    const confirmationNumber=Number(req.body.confirmationNumber)
    const org_rule= await Organization.findOne({organizationCode:orgcode},{rulesAndRegulation:1})
    //give max date dynamically
    const max_date=10
    // console.log(Number(org_rule?.rulesAndRegulation?.maxReturnDate))
    if(schedule&&moment(schedule.departureDateAndTime).add(max_date,'d').isAfter(timenow))
    {
      const {isPassangerDeparted,isTicketRefunded}=schedule.passangerInfo.filter(e=>e.uniqueId==pass_id)[0]
      if(isPassangerDeparted)
      {
        const error=new Error("this passanger already departed")
        error.statusCode=401
        throw error
      }
      if(isTicketRefunded)
      {
        const error=new Error("this ticket already refunded")
        error.statusCode=401
        throw error
      }
    if(schedule.passangerInfo?.filter(e=>e.confirmationNumber===confirmationNumber).length==0)
    {
    const error=new Error("Invalid confirmation number")
    error.statusCode=401
    throw error
      }
    if(moment(schedule.departureDateAndTime).isAfter(timenow))
    { 
      const scheduleData=await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].isTicketCanceled":true,
      "passangerInfo.$[el].isTicketRefunded":true,"passangerInfo.$[el].refundedBy":refunder_id,
      "passangerInfo.$[el].sitCanceled":pass_sit},$pull:{occupiedSitNo: pass_sit }},
      {arrayFilters:[{"el.uniqueId":pass_id}],session,new:true,useFindAndModify:false})
      if(refunder_role===process.env.CASHER)
      {
        // make 0.5 from organization rule
      const deduceCash=Number(scheduleData.tarif)*0.5
      if(bookerRole===process.env.CASHER)
      {
      await Managecash.findOneAndUpdate({user:refunder_id},
        {$inc:{cashInHand:-deduceCash,
          totalRefundedAmount:deduceCash,
          totalRefundedTicket:1,},
      },
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
      }
    }
    else{
      const scheduleData=await Schedule.findByIdAndUpdate(schedule_id,{$set:{"passangerInfo.$[el].isTicketCanceled":true,
      "passangerInfo.$[el].isTicketRefunded":true,"passangerInfo.$[el].refundedBy":refunder_id,
      "passangerInfo.$[el].sitCanceled":pass_sit}},
      {arrayFilters:[{"el.uniqueId":pass_id}],new:true,session,useFindAndModify:false})
      if(refunder_role===process.env.CASHER)
      {
        // make 0.5 from organization rule
      const deduceCash=Number(scheduleData.tarif)*0.5
      if(bookerRole===process.env.CASHER)
      {
      await Managecash.findOneAndUpdate({user:refunder_id},
        {$inc:{cashInHand:-deduceCash,
          totalRefundedAmount:deduceCash,
          totalRefundedTicket:1,},
      },
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

      }
    }
    await session.commitTransaction()
    return res.json({message:"refund done"})
  }
  const error=new Error("ticket refund Date Exired")
  error.statusCode=401
  throw error
  }
  catch(error) {
    await session.abortTransaction();
    next(error)
  }
}


