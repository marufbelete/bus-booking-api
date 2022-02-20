const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {addSchedule,bookTicketFromSchedule,assignBusToSchedule,cancelSchedule,undoCanceldSchedule}= require("../controllers/schedulemanage.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/route.controller")
const {createRole,getRole,deleteRole}=require("../controllers/manageRole.controller")
const {addPolicy,getPolicy,updatePolicyInfo,deletePolicy}=require("../controllers/policy.controller")
const {createOrganization,getAllOrganization,getOrganizationByCode,updateOrganization,deleteOrganization, getOrganizationById}=require("../controllers/organization.controller")
const {registerHotelOrPension,getGetAllHotelOrPension,getGetAllHotelOrPensionByCity,updateHotelOrPensionInfo,deleteHotelOrPension}=require("../controllers/hotelandpension.controller")
// const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/feedback.controller")
const {registerCity,getAllOrganizationCity,updateCityInfo,deleteCity}=require("../controllers/city.controller")
const {registerBus,getAllOrganizationBus,updateBusInfo,deleteBus}=require("../controllers/bus.controller")

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
router.put('/updaterouteinfo',userauth,authaAdminCasher,updateRouteInfo,errorHandler)
router.delete('/deleteroute',userauth,authaAdminCasher,deleteRoute,errorHandler)
//schedule
router.post('/addschedule',userauth,authaAdminCasher,addSchedule,errorHandler)
router.post('/bookticketfromschedule',userauth,bookTicketFromSchedule,errorHandler)
router.put('/cancelschedule',userauth,cancelSchedule,errorHandler)
router.put('/assignbustoschedule',userauth,assignBusToSchedule,errorHandler)
router.put('/undocanceledschedule',userauth,undoCanceldSchedule,errorHandler)
//role
router.post('/addrole',userauth,authaAdminCasher,createRole,errorHandler)
router.get('/getrole',userauth,authaAdminCasher,getRole,errorHandler)
router.delete('/deleterole',userauth,authaAdminCasher,deleteRole,errorHandler)
//policy
router.post('/addpolicy',userauth,authaAdminCasher,addPolicy,errorHandler)
router.get('/getpolicy',userauth,authaAdminCasher,getPolicy,errorHandler)
router.put('/updatepolicy',userauth,authaAdminCasher,updatePolicyInfo,errorHandler)
router.delete('/deletepolicy',userauth,authaAdminCasher,deletePolicy,errorHandler)
//organization
router.post('/createorganization',userauth,authaAdminCasher,createOrganization,errorHandler)
router.get('/getallorganization',userauth,authaAdminCasher,getAllOrganization,errorHandler)
router.get('/getorganizationbyid',userauth,authaAdminCasher,getOrganizationById,errorHandler)
router.get('/getorganizationbycode',userauth,authaAdminCasher,getOrganizationByCode,errorHandler)
router.put('/updateorganization',userauth,authaAdminCasher,updateOrganization,errorHandler)
router.delete('/deleteorganization',userauth,authaAdminCasher,deleteOrganization,errorHandler)
//hotel and pension
router.post('/addhotelorpension',userauth,authaAdminCasher,registerHotelOrPension,errorHandler)
router.get('/getallhotelorpension',userauth,authaAdminCasher,getGetAllHotelOrPension,errorHandler)
router.put('/getallpensionbycity',userauth,authaAdminCasher,getGetAllHotelOrPensionByCity,errorHandler)
router.put('/updatehotelorpensioninfo',userauth,authaAdminCasher,updateHotelOrPensionInfo,errorHandler)
router.delete('/deletehotelorpension',userauth,authaAdminCasher,deleteHotelOrPension,errorHandler)
//city
router.post('/registercity',userauth,authaAdminCasher,registerCity,errorHandler)
router.get('/getallorganizationcity',userauth,authaAdminCasher,getAllOrganizationCity,errorHandler)
router.put('/updatecityinfo',userauth,authaAdminCasher,updateCityInfo,errorHandler)
router.delete('/deletecity',userauth,authaAdminCasher,deleteCity,errorHandler)
//bus
router.post('/registerbus',userauth,authaAdminCasher,registerBus,errorHandler)
router.get('/getallorganizationbus',userauth,authaAdminCasher,getAllOrganizationBus,errorHandler)
router.put('/updatebusinfo',userauth,authaAdminCasher,updateBusInfo,errorHandler)
router.delete('/deletebus',userauth,authaAdminCasher,deleteBus,errorHandler)


module.exports = router

