const Schedule = require("../models/schedule.model");

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
   const bus= await Schedule.findAndUpdateById(id,{
    $set:{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       PassangerOccupiedSitNo:psss_ocupied_sit_no,
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
   const bus= await Schedule.findAndUpdateById(id,{
    $set:{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       PassangerOccupiedSitNo:psss_ocupied_sit_no,
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
   const my_booking=await Schedule.findOne({driverUserName:username}).sort({datefield:-1})
   res.json(my_booking)
  }
  catch(error) {
    next(error)
  }
};

