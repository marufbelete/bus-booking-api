const Schedule = require("../models/schedule.model");

//create schedules
exports.addSchedule = async (req, res, next) => {
  try {
    const source = req.body.source;
    const destination = req.body.destination;
    const tarif= req.body.tarif;
    const distance = req.body.distance;
    const estimated_hour = req.body.estimatedhour;
    const departure_date= req.body.depdate;
    const departure_time = req.body.deptime;
    const departure_place = req.body.depplace;
    const number_of_schedule = req.body.numberofschedule;
    const created_by =req.user.sub;
    const orgcode =req.user.organization_code;
    const schedules=[]
    const newschedule= {
      source:source,
      destination:destination,
      tarif:tarif,
      distance:distance,
      estimatedHour:estimated_hour,
      departureDate:departure_date,
      departureTime:departure_time,
      departurePlace:departure_place,
      createdBy:created_by,
      organizationCode:orgcode,
    }
    for(let i=0;i<number_of_schedule;i++)
    {
      schedules.push(newschedule)
    }   
    const savedSchedule=await Schedule.insertMany(schedules)
    return res.json(savedSchedule)
  }
catch(error) {
next(error);
  }
};
//all schedule
exports.getAllSchedule = async (req, res, next) => {
  try {
  const orgcode =req.user.organization_code;
  const allSchedule= await Schedule.find({organizationCode:orgcode})
  const 
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
  const source=req.query.source;
  const destination=req.query.destination;
  const allSchedule= await Schedule.find({organizationCode:orgcode,source:source,destination:destination})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//book ticket
exports.bookTicketUsingSchedule = async (req, res, next) => {
  try {
   const id=req.params.id
   //name can be an array
   const passange_name = req.body.passname;
   const pass_phone_number = req.body.passphone;
   //booked sit number
   const psss_ocupied_sit_no= req.body.passoccupiedsit;
   const booked_by = req.body.sub;
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
//assign bus
exports.assignBusToSchedule = async (req, res, next) => {
  try {
   const id=req.params.id
   const bus_id = req.body.busid;
   const bus= await Schedule.findAndUpdateById(id,{
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
//cancel schedule
exports.changeScheduleStatus = async (req, res, next) => {
  try {
  //find and copmare the date if pass dont cancel
   const id=req.params.id
   const status= req.query.status
   await Schedule.findByIdAndUpdate(id,{$set:{
  isCanceled:status
   }})
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};

