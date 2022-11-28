const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,
  authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {addSchedule,lockSit,bookTicketFromSchedule,assignBusToSchedule,
  getRiservedSit,cancelSchedule,undoCanceldSchedule,getActiveScheduleByRoute,
   getAllSchgedule, getAllSpecialSchgedule,getAllFilterSchgedule,getSchgeduleById,
    updatePassinfo, updateScheduleDateAndTime, 
    checkTicketExist}= require("../controllers/schedulemanage.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute,
   updateRouteInfoBusAndPlace, getOrganizationDetailRoute, 
   getOrganizationBusByRoute, getOrganizationRouteById,
    getRouteDepPlace}=require("../controllers/route.controller")
const {createRole,getRole,deleteRole}=require("../controllers/manageRole.controller")
const {addPolicy,getPolicy,updatePolicyInfo,
  deletePolicy}=require("../controllers/policy.controller")
const {createOrganization,getAllOrganization,getOrganizationByCode,
  updateOrganization,deleteOrganization, getOrganizationById, 
  getMyOrganization, getOrgRules, 
  updateBrnach,
  updateSetting,
  updateOffer,
  updateRulesAndRegulation}=require("../controllers/organization.controller")
const {registerHotelOrPension,getGetAllHotelOrPension,
  getGetAllHotelOrPensionByCity,updateHotelOrPensionInfo,
  deleteHotelOrPension}=require("../controllers/hotelandpension.controller")
// const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/feedback.controller")
const {registerCity,getAllOrganizationCity,updateCityInfo,
  deleteCity, getAllDepPlace, getCityNameOnly, 
  getCity}=require("../controllers/city.controller")
const {registerBus,getAllOrganizationBus,updateBusStatus,
  updateBusInfo,deleteBus, getAllOrganizationBusByState, 
  getDetailOrganizationBus, getOrganizationActiveBus,
  getOrganizationFreeBusInRoute,
  getBusById}=require("../controllers/bus.controller")
const {getMobileSchgedule,updateMobilePassinfo,getTicketHistory,
  cancelTicket,getMyPassanger}=require("../controllers/mobileuserapi.controller")
const {errorHandler} = require('../middleware/errohandling.middleware')

const multer=require("multer");
const { registerAgent, getAllAgent, getAgentWithNoAccount, 
  updateAgentInfo, deleteAgent } = require('../controllers/agent.controller');
const { registerAccount, getAllOrganizationAccount,
   updateAccountInfo } = require('../controllers/bank.controller');
const { addPayment, getAllOrganizationPayment,
   updatePaymentInfo } = require('../controllers/payment.controller');
const { addLookup, getLookup, 
  updateLookupInfo } = require('../controllers/lookup.controller');
const router = express.Router();
const fileStorage = multer.memoryStorage()

// file compression
const filefilter = (req, file, cb) => {
    console.log("filter")
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else {
    const type=file.mimetype.split("/")[1]
    req.mimetypeError=`${type} file is not allowed please attach only image file`;
    cb(null, false,new Error(`${type} file is not allowed please attach only image file`))
    
  } 
}
const upload=multer({ storage: fileStorage, fileFilter: filefilter })

//route
router.post('/addroute',userauth,authaAdminCasher,addRoute,errorHandler)
router.get('/getorganizationroute',userauth,authaAdminCasher,getOrganizationRoute,errorHandler)
router.get('/getroutedepplace',userauth,authaAdminCasher,getRouteDepPlace,errorHandler)
router.get('/getorganizationroutebyid/:id',userauth,authaAdminCasher,getOrganizationRouteById,errorHandler)
router.get('/getorganizationdetailroute',userauth,authaAdminCasher,getOrganizationDetailRoute,errorHandler)
router.get('/getorganizationbusbyroute',userauth,authaAdminCasher,getOrganizationBusByRoute,errorHandler)
router.put('/updaterouteinfo/:id',userauth,authaAdminCasher,updateRouteInfo,errorHandler)
router.put('/updateroutebusandplace/:id',userauth,authaAdminCasher,updateRouteInfoBusAndPlace,errorHandler)
router.delete('/deleteroute/:id',userauth,authaAdminCasher,deleteRoute,errorHandler)
//schedule
router.post('/addschedule',userauth,authaAdminCasher,addSchedule,errorHandler)
router.put('/locksit/:id',userauth,lockSit,errorHandler)
router.put('/bookticketfromschedule/:id',userauth,bookTicketFromSchedule,errorHandler)
router.put('/cancelschedule/:id',userauth,cancelSchedule,errorHandler)
router.put('/assignbustoschedule/:id',userauth,assignBusToSchedule,errorHandler)
router.put('/updatedeparturedatetime/:id',userauth,updateScheduleDateAndTime,errorHandler)
router.put('/undocanceledschedule/:id',userauth,undoCanceldSchedule,errorHandler)
router.put('/updatepassinfo/:id',userauth,updatePassinfo,errorHandler)
router.get('/getreservedsit/:id',userauth,getRiservedSit,errorHandler)
router.get('/getdetailschedule',userauth,getAllSpecialSchgedule,errorHandler)
router.get('/getallschedule',userauth,getAllSchgedule,errorHandler)
router.get('/getallfilterschedule',userauth,getAllFilterSchgedule,errorHandler)
router.get('/getschedulebyid/:id',userauth,getSchgeduleById,errorHandler)

router.get('/getorganizationschedulebyroute',userauth,authaAdminCasher,getActiveScheduleByRoute,errorHandler)

//role
router.post('/addrole',userauth,authaAdminCasher,createRole,errorHandler)
router.get('/getrole',userauth,authaAdminCasher,getRole,errorHandler)
router.delete('/deleterole/:id',userauth,authaAdminCasher,deleteRole,errorHandler)
//policy
router.post('/addpolicy',userauth,authaAdminCasher,addPolicy,errorHandler)
router.get('/getpolicy',userauth,authaAdminCasher,getPolicy,errorHandler)
router.put('/updatepolicy/:id',userauth,authaAdminCasher,updatePolicyInfo,errorHandler)
router.delete('/deletepolicy/:id',userauth,authaAdminCasher,deletePolicy,errorHandler)
//agent
router.post('/addagent',userauth,authAdmin,registerAgent,errorHandler)
router.get('/getallagent',userauth,authAdmin,getAllAgent,errorHandler)
router.put('/updateagent/:id',userauth,authAdmin,updateAgentInfo,errorHandler)
router.get('/getagentwithnoaccount',userauth,authAdmin,getAgentWithNoAccount,errorHandler)
router.delete('/deleteagent/:id',userauth,authAdmin,deleteAgent,errorHandler)
//organization
router.post('/createorganization',userauth,authAdmin,upload.single('logo'),createOrganization,errorHandler)
router.get('/getallorganization',getAllOrganization,errorHandler)
router.get('/getmyorganization',userauth,authaAdminCasher,getMyOrganization,errorHandler)
router.get('/getmyorgrules',userauth,authaAdminCasher,getOrgRules,errorHandler)
router.get('/getorganizationbyid/:id',getOrganizationById,errorHandler)
router.get('/getorganizationbycode/:code',getOrganizationByCode,errorHandler)
router.put('/updateorganization/:id',userauth,authSuperAdmin,upload.single('logo'),updateOrganization,errorHandler)
router.put('/updateborganizationbranch/:id',userauth,authSuperAdmin,updateBrnach,errorHandler)
router.put('/updateborganizationsetting/:id',userauth,authSuperAdmin,updateSetting,errorHandler)
router.put('/updateborganizationoffer/:id',userauth,authSuperAdmin,updateOffer,errorHandler)
router.put('/updateborganizationrules/:id',userauth,authSuperAdmin,updateRulesAndRegulation,errorHandler)
router.delete('/deleteorganization/:id',userauth,authOwner,deleteOrganization,errorHandler)
//hotel and pension
router.post('/addhotelorpension',userauth,authaAdminCasher,registerHotelOrPension,errorHandler)
router.get('/getallhotelorpension',userauth,authaAdminCasher,getGetAllHotelOrPension,errorHandler)
router.put('/getallpensionbycity',userauth,authaAdminCasher,getGetAllHotelOrPensionByCity,errorHandler)
router.put('/updatehotelorpensioninfo/:id',userauth,authaAdminCasher,updateHotelOrPensionInfo,errorHandler)
router.delete('/deletehotelorpension/:id',userauth,authaAdminCasher,deleteHotelOrPension,errorHandler)
//bank
router.post('/addaccount',userauth,authaAdminCasher,registerAccount,errorHandler)
router.get('/getallorganizationaccount',userauth,authaAdminCasher,getAllOrganizationAccount,errorHandler)
router.put('/updateaccount/:id',userauth,authaAdminCasher,updateAccountInfo,errorHandler)
//payment
router.post('/addpayment',userauth,authaAdminCasher,addPayment,errorHandler)
router.get('/getallorganizationpayment',userauth,authaAdminCasher,getAllOrganizationPayment,errorHandler)
router.put('/updatepayment/:id',userauth,authaAdminCasher,updatePaymentInfo,errorHandler)
//lookup
router.post('/addlookup',userauth,authaAdminCasher,addLookup,errorHandler)
router.get('/getlookup',userauth,authaAdminCasher,getLookup,errorHandler)
router.put('/updatelookup/:id',userauth,authaAdminCasher,updateLookupInfo,errorHandler)
//city
router.post('/registercity',userauth,authaAdminCasher,registerCity,errorHandler)
router.get('/getallorganizationcity',userauth,authaAdminCasher,getAllOrganizationCity,errorHandler)
router.get('/getalldepartureplace',userauth,authaAdminCasher,getAllDepPlace,errorHandler)
router.get('/getcityonly',userauth,authaAdminCasher,getCityNameOnly,errorHandler)
router.put('/updatecityinfo/:id',userauth,authaAdminCasher,updateCityInfo,errorHandler)
router.delete('/deletecity/:id',userauth,authaAdminCasher,deleteCity,errorHandler)
//bus
router.post('/registerbus',userauth,authaAdminCasher,registerBus,errorHandler)
router.get('/getorganizationfreebusbydateinroute',userauth,authAdmin,getOrganizationFreeBusInRoute,errorHandler)
router.get('/getallorganizationbus',userauth,authaAdminCasher,getAllOrganizationBus,errorHandler)
router.get('/getbusbyid',userauth,authaAdminCasher,getBusById,errorHandler)
router.get('/getdetailorganizationbus',userauth,authaAdminCasher,getDetailOrganizationBus,errorHandler)
router.put('/updatebusinfo/:id',userauth,authaAdminCasher,updateBusInfo,errorHandler)
router.get('/getorganizationbusbystate',userauth,authaAdminCasher,getAllOrganizationBusByState,errorHandler)
router.get('/getorganizationactivebus',userauth,authaAdminCasher,getOrganizationActiveBus,errorHandler)
router.put('/updatebusstatus/:id',userauth,authaAdminCasher,updateBusStatus,errorHandler)
router.delete('/deletebus/:id',userauth,authaAdminCasher,deleteBus,errorHandler)

//mobile
router.get('/getorganizationlist',getAllOrganization,errorHandler)
router.get('/getschedule',getMobileSchgedule,errorHandler)
router.put('/updatepassangerinfo/:id',updateMobilePassinfo,errorHandler)
router.get('/getmytickethistory',getTicketHistory,errorHandler)
router.put('/cancelticket/:id',cancelTicket,errorHandler)
router.get('/getmypassanger',getMyPassanger,errorHandler)
router.put('/locksitmobile/:id',lockSit,errorHandler)
router.put('/bookticket/:id',bookTicketFromSchedule,errorHandler)
router.get('/getsitreserved/:id',getRiservedSit,errorHandler)
router.get('/getcity',getCity,errorHandler)//mobile
//qr code 
router.get('/checkticket',checkTicketExist,errorHandler)//mobile
// router.get('/cancelticket',userauth,cancelTicket,errorHandler)//mobile



module.exports = router

