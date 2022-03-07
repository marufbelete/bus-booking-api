const Schedule = require("../models/schedule.model");
const ShortUniqueId = require('short-unique-id');
//create schedules need io here
let sitTimer
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
    const created_by =req.userinfo.sub;
    const orgcode =req.userinfo.organization_code;

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
//lock sit 
exports.lockSit = async (req, res, next) => {
  try {
   const id=req.params.id
   const timenow=Date.now()
   const sit =[20,21]
    // req.body.sitnumber;
   const bus= await Schedule.findOneAndUpdate({_id:id},{
     $addToSet:{
      occupiedSitNo:{$each:sit}
     }
   },{new:true})
   const unlockSit=async()=>{ 
    await Schedule.findOneAndUpdate({_id:id},{
      $pullAll:{
        occupiedSitNo:sit
       }
   },{new:true})
}
   //socket io 
   sitTimer=setTimeout(unlockSit,30000)
   req.sitlock=sitTimer
   res.json(bus)
  }
  catch(error) {
    next(error)
  }
}

//book ticket use io
exports.bookTicketFromSchedule = async (req, res, next) => {
  try {
    clearTimeout(sitTimer)
   const id=req.params.id
   //name can be an array
   const passange_name = req.body.passname;
   const pass_phone_number = req.body.passphone;
   //booked sit number
   const psss_ocupied_sit_no= [13,14]
  //req.body.passoccupiedsit;
   //some unique id
   const booked_by = req.userinfo.sub;
   const uid = new ShortUniqueId({ length: 12 });
   console.log(uid())
   const bus= await Schedule.findByIdAndUpdate(id,{
      $push:{passangerInfo:{passangerName:passange_name,
       passangerPhone:pass_phone_number,
       passangerOccupiedSitNo:psss_ocupied_sit_no,
       uniqueId:uid(),
       bookedBy:booked_by}},
       $addToSet:{occupiedSitNo:{$each:psss_ocupied_sit_no}},
   },{new:true})
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
   const canceler_id=req.userinfo.sub
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
   const canceler_id=req.userinfo.sub
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

