const Schedule = require("../models/schedule.model");
const ShortUniqueId = require('short-unique-id');
//create schedules need io here
exports.addSchedule = async (req, res, next) => {
  try {
    const source = req.body.source;
    const destination = req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date_and_time= req.body.depdateandtime;
    const departure_place = req.body.depplace;
    const number_of_schedule = req.body.numberofschedule;
    const created_by =req.user.sub;
    const orgcode =req.user.organization_code;

    if(!!source && !!destination && !! tarif && !!departure_date_and_time)
   {
    const schedules=[]
    const newschedule= {
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      departureDateAndTime:departure_date_and_time,
      departurePlace:departure_place,
      createdBy:created_by,
      organizationCode:orgcode,
    }
    for(let i=0;i<number_of_schedule;i++)
    {
      schedules.push(newschedule)
    }   
    const savedSchedule=await Schedule.insertMany(schedules)
    console.log(schedules)
    return res.json(savedSchedule)
  }
  const error=new Error("please fill all required field")
  error.statusCode=401
  throw error
  }
catch(error) {
next(error);
  }
};
//all schedules not used much
exports.getAllSchedule = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 40
    let skip = pagesize * page
  const orgcode =req.user.organization_code;
  const allSchedule= await Schedule.find({organizationCode:orgcode}).limit(pagesize).skip(skip).sort({datefield:-1})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//all schedules for that casher or agent
exports.getAllMySale = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 20
    let skip = pagesize * page
  const orgcode =req.user.organization_code;
  const saler_id =req.user.sub;
  const role_type=req.user.user_role;
  const allSchedule= await Schedule.find({organizationCode:orgcode,userRole:role_type,"passangerInfo.bookedBy":saler_id}).limit(pagesize).skip(skip).sort({datefield:-1})
  const all_my_sale=allSchedule.map(eachdoc=> {return {source:eachdoc.source,destination:eachdoc.destination,tarif:eachdoc.tarif,departureDateAndTime:eachdoc.departureDateAndTime,departurePlace:eachdoc.departurePlace,passInfo:y.passInfo.filter(filterpassanger=>{return filterpassanger.bookedby===role_type})}})
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
  const orgcode =req.user.organization_code;
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
  const timenow=Date.now();
  const allSchedule= await Schedule.find({organizationCode:orgcode,isCanceled:false,departureTDateAndTime:{$gte:timenow}}).limit(pagesize).skip(skip).sort({datefield:-1})
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
  const timenow=Date.now();
  const source=req.query.source;
  const destination=req.query.destination;
  const allSchedule= await Schedule.find({organizationCode:orgcode,source:source,destination:destination,isCanceled:false,departureDateAndTime:{$gte:timenow}})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//for mobile user only
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
  const timenow=Date.now();
  conditions.push({source:source,destination:destination,isCanceled:false,departureDateAndTime:{$gte:timenow}})
  const final_condtion={$and:conditions}
 
  const allSchedule= await Schedule.find(final_condtion).limit(pagesize).skip(skip).sort({datefield:-1})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//book ticket use io
exports.bookTicketFromSchedule = async (req, res, next) => {
  try {
   const id=req.params.id
   //name can be an array
   const passange_name = req.body.passname;
   const pass_phone_number = req.body.passphone;
   //booked sit number
   const psss_ocupied_sit_no= req.body.passoccupiedsit;
   //some unique id
   const booked_by = req.user.sub;
   const uid = new ShortUniqueId({ length: 10 });
   const bus= await Schedule.findAndUpdateById(id,{
    $set:{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       PassangerOccupiedSitNo:psss_ocupied_sit_no,
       uniqueId:uid,
       bookedBy:booked_by}},
       $addToSet:{occupiedSitNo:{$each:psss_ocupied_sit_no}},
      }
   })
   res.json(bus)
  }
  catch(error) {
    next(error)
  }
};

//assign bus iopost
exports.assignBusToSchedule = async (req, res, next) => {
  try {
   const id=req.params.id
   const bus_id = req.body.busid;
   const timenow=Date.now()
   const bus= await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{
     $set:{
      assignedBus:bus_id
     }
   })
   res.json(bus)
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
   const canceler_id=req.user.sub
   const timenow=Date.now()
   await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isCanceled:true,
  canceledBy:canceler_id
   }})
   res.json("deleted successfully")
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
   const canceler_id=req.user.sub
   const timenow=Date.now()
   await Schedule.findOneAndUpdate({_id:id,departureDateAndTime:{$gte:timenow}},{$set:{
  isCanceled:false,
  canceledBy:canceler_id
   }})
   res.json("deleted successfully")
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
   const user_id=req.user.sub
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
  //selecte the field in all api
  // for departure date lethan now
   const username=req.user.phone_number
   const timenow = Date.now()
   const my_booking=await Schedule.findOne({driverUserName:username}).sort({datefield:-1})
   res.json(my_booking)
  }
  catch(error) {
    next(error)
  }
};
//transfer schedule request will send request notification to other org nothing more
exports.scheduleTransferRequest = async (req, res, next) => {
  try {
   const schedule_id=req.body.scheduleid
   //find unique socket of organization that we want to send request notification
   const socket_id=req.body.scoketid
  io.getIo().emit({action:"transfer request",value:schedule_id})
   res.json("request sent successfully")
  }
  catch(error) {
    next(error)
  }
};
// accept transfer schedule
exports.acceptScheduleTransferRequest = async (req, res, next) => {
  const session=await Schedule.startSession()
  try {
    session.startTransaction();
   const schedule_id=req.query.scheduleid
   const transfer_info=await Schedule.aggregate([
     {$match:{_id:schedule_id}},
     {$project:{source:1,destination:1,tarif:1,passangerInfo:1,departureDateAndTime:1,numberOfPassanger:{$size:"$occupiedSitNo"},occupiedSit1:"$occupiedSitNo"},
     }
   ])
   //find the intersection of the two occupied sit
   const for_schedule_accepting =await Schedule.findOne(
    {source:transfer_info.source,distination:transfer_info.destination,departureDateAndTime:transfer_info.departureDateAndTime,
     $expr:{$gte:[{$subtract:["$totalNoOfSit",{$size:"$occupiedSitNo"}]},transfer_info.numberOfPassanger]}})
let occupied1 = transfer_info.occupiedSit1;
let occupied2 = for_schedule_accepting.occupiedSitNo;
const intersection = occupied1.filter(element => occupied2.includes(element));
let only_in_occupied1=occupied1.filter((elem=>!occupied2.includes(elem)))
//generate unique number which is not in occpied2 if there is an intersection
const generated_sit=[]
const final_transfer_sit
function between(min, max) {  
  let random= Math.floor(Math.random() * (max - min + 1) + min)
  while(occupied2.includes(random)){
    random= Math.floor(Math.random() * (max - min + 1) + min)
    continue
  }
    return random
}
if(intersection.length>0)
{
for (let i=0;i<intersection.length; i++)
{
  let sit=between(1, 49)
  generated_sit.push(sit)
}
 final_transfer_sit=[...only_in_occupied1,...generated_sit]
}
  //transfer maping for user info
  const add_passanger_info=transfer_info.passangerInfo.map((elem)=>{
    const each_intersection = elem.passangerOccupiedSitNo.filter(eachelem => occupied2.includes(eachelem));
    let each_pass_sit=elem.passangerOccupiedSitNo.map((esit)=>
    {
       if(each_intersection.includes(esit))
       {
         return generated_sit.splice(-1)[0]
        }
        else {return esit}
    })
    return {...elem,passangerOccupiedSitNo:each_pass_sit}
  })
   //find and insert to shedule which can accomodate those passanger in given date
   //solve the sit number issue
   const accpting_schedule_id=for_schedule_accepting._id
   await Schedule.findOneAndUpdate({_id:accpting_schedule_id},
     {
     $set:{ passangerInfo:{$addToSet:{$each:add_passanger_info}},occupiedSitNo:[...final_transfer_sit,...occupied2]}
     },
     {session,new:true}
     )
   //make istransferd true
   await Schedule.findByIdAndUpdate(schedule_id,{
     $set:{
      isTransfered:true,
     }
   },{session,new:true})
   //find unique socket of organization that we want to send request notification
   const socket_id=req.body.scoketid
  await session.commitTransaction();
  io.getIo().emit({action:"RequestAccepted",value:"your request is accepted by Name of the company"})
  res.json("request sent successfully")
  }
  catch(error) {
    await session.abortTransaction();
    next(error)
  }
};
//transfer schedule request rejected
exports.rejectScheduleTransferRequest = async (req, res, next) => {
  try {
io.getIo().emit({action:"RequestRejected",value:"your request isnot accepted by Name of the company"})
 return 
  }
  catch(error) {
    next(error)
  }
}
//postpone trip for specific user
exports.postponeTrip = async (req, res, next) => {
  const session=await Schedule.startSession()
  try {
    const schedule_id=req.body.id
    const source=req.body.source
    const destination=req.body.destination
    const new_departure_date=req.body.newdeparturedate
    const orgcode=req.user.organization_code
    const pass_phone_number=req.body.passphone
    const passange_name=req.body.passname
    const passanger_unique_id=req.body.passangerid
    const booked_by=req.body.bookedby
    const total_sit_arr=req.body.reservedsit
    const postpone_to=await Schedule.findOne({source:source,destination:destination,departureDateAndTime:new_departure_date,organizationCode:orgcode})
    const occup_sit=postpone_to.occupiedSitNo
    //sit not allowed
    const sit_not_allowed=total_sit_arr.filter((elem)=>{
      return occup_sit.includes(elem)
    })
    const generated_sit=[]
//sit allowed
    const sit_allowed=total_sit_arr.filter((elem)=>{
      return !occup_sit.includes(elem)
    })
    //change sit not allowed to random allowed sit
    function between(min, max) {  
      let random= Math.floor(Math.random() * (max - min + 1) + min)
      while(occupied2.includes(random)){
        random= Math.floor(Math.random() * (max - min + 1) + min)
        continue
      }
        return random
    }
    if(intersection.length>0)
    {
    
    for (let i=0;i<sit_not_allowed.length; i++)
    {
      let sit=between(1, 49)
      generated_sit.push(sit)
    }
  }
  const new_allowed_sit=sit_not_allowed.map((ele)=>{
     return generated_sit.splice(-1)[0]
  })
  const submit_sit=[...sit_allowed,...new_allowed_sit]
    //solve the sit issue
    session.startTransaction()
    await Schedule.findOneAndUpdate({_id:postpone_to._id},
      {
        $set:{
          $push:{passangerInfo:{passangerName:passange_name,
           passangerPhone:pass_phone_number,
           uniqueId:passanger_unique_id,
           PassangerOccupiedSitNo:submit_sit,
           bookedBy:booked_by}},
           $addToSet:{occupiedSitNo:{$each:submit_sit}},
          }
      },{session,new:true})
      const change_preivious_schedule=await Schedule.findOneAndUpdate({_id:schedule_id},
        {$set:{"passangerInfo.$[el].isPassangerPostponed":true}},
        {arrayFilters:[{"el.uniqueId":passanger_unique_id}],session,new:true})
      session.commitTransaction()

 return res.json()
  }
  catch(error) {
    await session.abortTransaction();
    next(error)
  }
}

