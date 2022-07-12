const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {addSchedule,lockSit,bookTicketFromSchedule,assignBusToSchedule,getRiservedSit,cancelSchedule,undoCanceldSchedule,getActiveScheduleByRoute, getAllSchgedule, getAllSpecialSchgedule,getAllFilterSchgedule,getSchgeduleById}= require("../controllers/schedulemanage.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/route.controller")
const {createRole,getRole,deleteRole}=require("../controllers/manageRole.controller")
const {addPolicy,getPolicy,updatePolicyInfo,deletePolicy}=require("../controllers/policy.controller")
const {createOrganization,getAllOrganization,getOrganizationByCode,updateOrganization,deleteOrganization, getOrganizationById}=require("../controllers/organization.controller")
const {registerHotelOrPension,getGetAllHotelOrPension,getGetAllHotelOrPensionByCity,updateHotelOrPensionInfo,deleteHotelOrPension}=require("../controllers/hotelandpension.controller")
// const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/feedback.controller")
const {registerCity,getAllOrganizationCity,updateCityInfo,deleteCity, getAllDepPlace}=require("../controllers/city.controller")
const {registerBus,getAllOrganizationBus,updateBusStatus,updateBusInfo,deleteBus, getAllOrganizationBusByState, getDetailOrganizationBus, getOrganizationActiveBus}=require("../controllers/bus.controller")

const {errorHandler} = require('../middleware/errohandling.middleware')

const multer=require("multer");
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
router.put('/updaterouteinfo/:id',userauth,authaAdminCasher,updateRouteInfo,errorHandler)
router.delete('/deleteroute/:id',userauth,authaAdminCasher,deleteRoute,errorHandler)
//schedule
router.post('/addschedule',userauth,authaAdminCasher,addSchedule,errorHandler)
router.put('/locksit/:id',userauth,lockSit,errorHandler)
router.put('/bookticketfromschedule/:id',userauth,bookTicketFromSchedule,errorHandler)
router.put('/cancelschedule/:id',userauth,cancelSchedule,errorHandler)
router.put('/assignbustoschedule/:id',userauth,assignBusToSchedule,errorHandler)
router.put('/undocanceledschedule/:id',userauth,undoCanceldSchedule,errorHandler)
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
//organization
router.post('/createorganization',userauth,authOwner,createOrganization,errorHandler)
router.get('/getallorganization',userauth,authOwner,getAllOrganization,errorHandler)
router.get('/getorganizationbyid/:id',userauth,authOwner,getOrganizationById,errorHandler)
router.post('/getorganizationbycode',getOrganizationByCode,errorHandler)
router.put('/updateorganization/:id',userauth,authOwner,updateOrganization,errorHandler)
router.delete('/deleteorganization/:id',userauth,authOwner,deleteOrganization,errorHandler)
//hotel and pension
router.post('/addhotelorpension',userauth,authaAdminCasher,registerHotelOrPension,errorHandler)
router.get('/getallhotelorpension',userauth,authaAdminCasher,getGetAllHotelOrPension,errorHandler)
router.put('/getallpensionbycity',userauth,authaAdminCasher,getGetAllHotelOrPensionByCity,errorHandler)
router.put('/updatehotelorpensioninfo/:id',userauth,authaAdminCasher,updateHotelOrPensionInfo,errorHandler)
router.delete('/deletehotelorpension/:id',userauth,authaAdminCasher,deleteHotelOrPension,errorHandler)
//city
router.post('/registercity',userauth,authaAdminCasher,registerCity,errorHandler)
router.get('/getallorganizationcity',userauth,authaAdminCasher,getAllOrganizationCity,errorHandler)
router.get('/getalldepartureplace',userauth,authaAdminCasher,getAllDepPlace,errorHandler)
router.put('/updatecityinfo/:id',userauth,authaAdminCasher,updateCityInfo,errorHandler)
router.delete('/deletecity/:id',userauth,authaAdminCasher,deleteCity,errorHandler)
//bus
router.post('/registerbus',userauth,authaAdminCasher,registerBus,errorHandler)
router.get('/getallorganizationbus',userauth,authaAdminCasher,getAllOrganizationBus,errorHandler)
router.get('/getdetailorganizationbus',userauth,authaAdminCasher,getDetailOrganizationBus,errorHandler)
router.put('/updatebusinfo/:id',userauth,authaAdminCasher,updateBusInfo,errorHandler)
router.get('/getorganizationbusbystate',userauth,authaAdminCasher,getAllOrganizationBusByState,errorHandler)
router.get('/getorganizationactivebus',userauth,authaAdminCasher,getOrganizationActiveBus,errorHandler)
router.put('/updatebusstatus/:id',userauth,authaAdminCasher,updateBusStatus,errorHandler)
router.delete('/deletebus/:id',userauth,authaAdminCasher,deleteBus,errorHandler)



module.exports = router

