const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {addSchedule,lockSit,bookTicketFromSchedule,assignBusToSchedule,getRiservedSit,cancelSchedule,undoCanceldSchedule}= require("../controllers/schedulemanage.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/route.controller")
const {createRole,getRole,deleteRole}=require("../controllers/manageRole.controller")
const {addPolicy,getPolicy,updatePolicyInfo,deletePolicy}=require("../controllers/policy.controller")
const {createOrganization,getAllOrganization,getOrganizationByCode,updateOrganization,deleteOrganization, getOrganizationById}=require("../controllers/organization.controller")
const {registerHotelOrPension,getGetAllHotelOrPension,getGetAllHotelOrPensionByCity,updateHotelOrPensionInfo,deleteHotelOrPension}=require("../controllers/hotelandpension.controller")
// const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/feedback.controller")
const {registerCity,getAllOrganizationCity,updateCityInfo,deleteCity}=require("../controllers/city.controller")
const {registerBus,getAllOrganizationBus,getAllOrganizationActiveBus,getAllOrganizationInactiveBus,getAllOrganizationOnRepairBus,getAllOrganizationDamagedBus,updateBusStatus,updateBusInfo,deleteBus}=require("../controllers/bus.controller")

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

// //route
// router.post('/addroute',userauth,authaAdminCasher,addRoute,errorHandler)
// router.get('/getorganizationroute',userauth,authaAdminCasher,getOrganizationRoute,errorHandler)
// router.put('/updaterouteinfo/:id',userauth,authaAdminCasher,updateRouteInfo,errorHandler)
// router.delete('/deleteroute/:id',userauth,authaAdminCasher,deleteRoute,errorHandler)
// //schedule
// router.post('/addschedule',userauth,authaAdminCasher,addSchedule,errorHandler)
// router.put('/locksit/:id',userauth,lockSit,errorHandler)
// router.put('/bookticketfromschedule/:id',userauth,bookTicketFromSchedule,errorHandler)
// router.put('/cancelschedule/:id',userauth,cancelSchedule,errorHandler)
// router.put('/assignbustoschedule/:id',userauth,assignBusToSchedule,errorHandler)
// router.put('/undocanceledschedule/:id',userauth,undoCanceldSchedule,errorHandler)
// router.get('/getreservedsit/:id',userauth,getRiservedSit,errorHandler)
// //role
// router.post('/addrole',userauth,authaAdminCasher,createRole,errorHandler)
// router.get('/getrole',userauth,authaAdminCasher,getRole,errorHandler)
// router.delete('/deleterole/:id',userauth,authaAdminCasher,deleteRole,errorHandler)
// //policy
// router.post('/addpolicy',userauth,authaAdminCasher,addPolicy,errorHandler)
// router.get('/getpolicy',userauth,authaAdminCasher,getPolicy,errorHandler)
// router.put('/updatepolicy/:id',userauth,authaAdminCasher,updatePolicyInfo,errorHandler)
// router.delete('/deletepolicy/:id',userauth,authaAdminCasher,deletePolicy,errorHandler)
// //organization
// router.post('/createorganization',userauth,authOwner,createOrganization,errorHandler)
// router.get('/getallorganization',userauth,authOwner,getAllOrganization,errorHandler)
// router.get('/getorganizationbyid/:id',userauth,authOwner,getOrganizationById,errorHandler)
// router.get('/getorganizationbycode/:code',userauth,authOwner,getOrganizationByCode,errorHandler)
// router.put('/updateorganization/:id',userauth,authOwner,updateOrganization,errorHandler)
// router.delete('/deleteorganization/:id',userauth,authOwner,deleteOrganization,errorHandler)
// //hotel and pension
// router.post('/addhotelorpension',userauth,authaAdminCasher,registerHotelOrPension,errorHandler)
// router.get('/getallhotelorpension',userauth,authaAdminCasher,getGetAllHotelOrPension,errorHandler)
// router.put('/getallpensionbycity',userauth,authaAdminCasher,getGetAllHotelOrPensionByCity,errorHandler)
// router.put('/updatehotelorpensioninfo/:id',userauth,authaAdminCasher,updateHotelOrPensionInfo,errorHandler)
// router.delete('/deletehotelorpension/:id',userauth,authaAdminCasher,deleteHotelOrPension,errorHandler)
// //city
// router.post('/registercity',userauth,authaAdminCasher,registerCity,errorHandler)
// router.get('/getallorganizationcity',userauth,authaAdminCasher,getAllOrganizationCity,errorHandler)
// router.put('/updatecityinfo/:id',userauth,authaAdminCasher,updateCityInfo,errorHandler)
// router.delete('/deletecity/:id',userauth,authaAdminCasher,deleteCity,errorHandler)
// //bus
// router.post('/registerbus',userauth,authaAdminCasher,registerBus,errorHandler)
// router.get('/getallorganizationbus',userauth,authaAdminCasher,getAllOrganizationBus,errorHandler)
// router.put('/updatebusinfo/:id',userauth,authaAdminCasher,updateBusInfo,errorHandler)
// router.get('/getallorganizationactivebus',userauth,authaAdminCasher,getAllOrganizationActiveBus,errorHandler)
// router.get('/getallorganizationinactivebus',userauth,authaAdminCasher,getAllOrganizationInactiveBus,errorHandler)
// router.get('/getallorganizationonrepairbus',userauth,authaAdminCasher,getAllOrganizationOnRepairBus,errorHandler)
// router.get('/getallorganizationdamagedbus',userauth,authaAdminCasher,getAllOrganizationDamagedBus,errorHandler)
// router.put('/updatebusstatus/:id',userauth,authaAdminCasher,updateBusStatus,errorHandler)
// router.delete('/deletebus/:id',userauth,authaAdminCasher,deleteBus,errorHandler)

//teset

//route
router.post('/addroute',addRoute,errorHandler)
router.get('/getorganizationroute',getOrganizationRoute,errorHandler)
router.put('/updaterouteinfo/:id',updateRouteInfo,errorHandler)
router.delete('/deleteroute/:id',deleteRoute,errorHandler)
//schedule
router.post('/addschedule',addSchedule,errorHandler)
router.put('/locksit/:id',lockSit,errorHandler)
router.put('/bookticketfromschedule/:id',bookTicketFromSchedule,errorHandler)
router.put('/cancelschedule/:id',cancelSchedule,errorHandler)
router.put('/assignbustoschedule/:id',assignBusToSchedule,errorHandler)
router.put('/undocanceledschedule/:id',undoCanceldSchedule,errorHandler)
router.get('/getreservedsit/:id',getRiservedSit,errorHandler)
//role
router.post('/addrole',createRole,errorHandler)
router.get('/getrole',getRole,errorHandler)
router.delete('/deleterole/:id',deleteRole,errorHandler)
//policy
router.post('/addpolicy',addPolicy,errorHandler)
router.get('/getpolicy',getPolicy,errorHandler)
router.put('/updatepolicy/:id',updatePolicyInfo,errorHandler)
router.delete('/deletepolicy/:id',deletePolicy,errorHandler)
//organization
router.post('/createorganization',createOrganization,errorHandler)
router.get('/getallorganization',getAllOrganization,errorHandler)
router.get('/getorganizationbyid/:id',getOrganizationById,errorHandler)
router.get('/getorganizationbycode/:code',getOrganizationByCode,errorHandler)
router.put('/updateorganization/:id',updateOrganization,errorHandler)
router.delete('/deleteorganization/:id',deleteOrganization,errorHandler)
//hotel and pension
router.post('/addhotelorpension',registerHotelOrPension,errorHandler)
router.get('/getallhotelorpension',getGetAllHotelOrPension,errorHandler)
router.put('/getallpensionbycity',getGetAllHotelOrPensionByCity,errorHandler)
router.put('/updatehotelorpensioninfo/:id',updateHotelOrPensionInfo,errorHandler)
router.delete('/deletehotelorpension/:id',deleteHotelOrPension,errorHandler)
//city
router.post('/registercity',registerCity,errorHandler)
router.get('/getallorganizationcity',getAllOrganizationCity,errorHandler)
router.put('/updatecityinfo/:id',updateCityInfo,errorHandler)
router.delete('/deletecity/:id',deleteCity,errorHandler)
//bus
router.post('/registerbus',registerBus,errorHandler)
router.get('/getallorganizationbus',getAllOrganizationBus,errorHandler)
router.put('/updatebusinfo/:id',updateBusInfo,errorHandler)
router.get('/getallorganizationactivebus',getAllOrganizationActiveBus,errorHandler)
router.get('/getallorganizationinactivebus',getAllOrganizationInactiveBus,errorHandler)
router.get('/getallorganizationonrepairbus',getAllOrganizationOnRepairBus,errorHandler)
router.get('/getallorganizationdamagedbus',getAllOrganizationDamagedBus,errorHandler)
router.put('/updatebusstatus/:id',updateBusStatus,errorHandler)
router.delete('/deletebus/:id',deleteBus,errorHandler)

module.exports = router

