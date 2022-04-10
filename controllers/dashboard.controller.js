const Schedule = require("../models/schedule.model");
const {milliSecond}=require("../reusable_logic/sit_generator")
//all schedules not used much
exports.getAllSchedule = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 40
    let skip = pagesize * page
  const orgcode =req.userinfo.organization_code;
  const allSchedule= await Schedule.find({organizationCode:orgcode}).limit(pagesize).skip(skip).sort({datefield:-1})
  return res.json(allSchedule)
  }
  catch(error) {
  next(error)
  }
};
//agg
const all_criteria={}
if(req.params.source)
{
  all_criteria.source=req.params.source
}
all_criteria.destination=req.params.destination
all_criteria.destination=req.params.userid
all_criteria.destination=req.params.startdate
all_criteria.destination=req.params.enddate
await Schedule.aggregate( [
  {
     $match: {$and:{organizationCode:orgcode}}
  },
  // Stage 2: Group remaining documents by pizza name and calculate total quantity
  {
     $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
  }
] )

//all schedules for that casher or agent
exports.getAllMySale = async (req, res, next) => {
  try {
    let page = !!req.query.pageno ? req.query.pageno : 0
    let pagesize = 20
    let skip = pagesize * page
  const orgcode =req.userinfo.organization_code;
  const saler_id =req.userinfo.sub;
  const role_type=req.userinfo.user_role;
  const allSchedule= await Schedule.find({organizationCode:orgcode,userRole:role_type,"passangerInfo.bookedBy":saler_id}).limit(pagesize).skip(skip).sort({datefield:-1})
  const all_my_sale=allSchedule.map(eachdoc=> 
    {
      return {source:eachdoc.source,destination:eachdoc.destination,tarif:eachdoc.tarif,departureDateAndTime:eachdoc.departureDateAndTime,departurePlace:eachdoc.departurePlace,passInfo:y.passInfo.filter(filterpassanger=>{return filterpassanger.bookedby===role_type})}})
  return res.json(all_my_sale)
  }
  catch(error) {
  next(error)
  }
};
await Schedule.aggregate( [
  {
     $match: {$and:{organizationCode:orgcode}}
  },
  // Stage 2: Group remaining documents by pizza name and calculate total quantity
  {
     $group: { _id: "$passangerInfo.bookedBy", totalSale: { $sum: "$tarif" } }
  }
] )
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
      return {source:eachdoc.source,destination:eachdoc.destination,tarif:eachdoc.tarif,departureDateAndTime:eachdoc.departureDateAndTime,departurePlace:eachdoc.departurePlace,passInfo:y.passInfo.filter(filterpassanger=>{return filterpassanger.bookedby===role_type})}})
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
  //selecte the field in all api
  // for departure date lethan now
   const username=req.userinfo.phone_number;
   const addHour=2;
   const addMilisecond=milliSecond(addHour);
   const timenow = Date.now()+addMilisecond
   const my_booking=await Schedule.findOne({driverUserName:username,departureDateAndTime:{$lte:timenow}}).sort({datefield:-1})
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
