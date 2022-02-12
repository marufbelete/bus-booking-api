const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {addSchedule,bookTicketFromSchedule,assignBusToSchedule,cancelSchedule,undoCancelSchedule,myBookedTicketList}= require("../controllers/schedulemanage.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/route.controller")
const {createRole,getRole,updateRole,deleteRole}=require("../controllers/manageRole.controller")
const {addPolicy,getPolicy,updatePolicyInfo,deletePolicy}=require("../controllers/policy.controller")
const {createOrganization,getAllOrganization,getOrganizationByCode,getOrganizationByCode,updateOrganization,deleteOrganization, getOrganizationById}=require("../controllers/organization.controller")
const {registerHotelsAndPensions,getAllHotelOrPension,getAllHotelOrPensionByCity,updateHotelOrPensionInfo,deleteHotelOrPension}=require("../controllers/hotelandpension.controller")
const {addRoute,getOrganizationRoute,updateRouteInfo,deleteRoute}=require("../controllers/feedback.controller")
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
router.post('/addroute',addRoute,errorHandler)
router.get('/getorganizationroute',getOrganizationRoute,errorHandler)
router.put('/updaterouteinfo',updateRouteInfo,errorHandler)
router.delete('/deleteroute',deleteRoute,errorHandler)
//schedule
router.post('/addschedule',userauth,authaAdminCasher,addSchedule,errorHandler)
router.post('/bookticketfromschedule',userauth,bookTicketFromSchedule,errorHandler)
router.put('/cancelschedule',userauth,cancelSchedule,errorHandler)
router.put('/assignbustoschedule',userauth,assignBusToSchedule,errorHandler)
router.post('/mybookedticket',userauth,myBookedTicketList,errorHandler)
router.put('/undocanceledschedule',userauth,undoCancelSchedule,errorHandler)
//role
router.post('/addrole',createRole,errorHandler)
router.get('/getrole',getRole,errorHandler)
router.put('/updaterole',updateRole,errorHandler)
router.delete('/deleterole',deleteRole,errorHandler)
//policy
router.post('/addpolicy',addPolicy,errorHandler)
router.get('/getpolicy',getPolicy,errorHandler)
router.put('/updatepolicy',updatePolicyInfo,errorHandler)
router.delete('/deletepolicy',deletePolicy,errorHandler)
//organization
router.post('/createorganization',createOrganization,errorHandler)
router.get('/getallorganization',getAllOrganization,errorHandler)
router.get('/getorganizationbyid',getOrganizationById,errorHandler)
router.get('/getorganizationbycode',getOrganizationByCode,errorHandler)
router.put('/updateorganization',updateOrganization,errorHandler)
router.delete('/deleteorganization',deleteOrganization,errorHandler)
//hotel and pension
router.post('/addhotelorpension',registerHotelsAndPensions,errorHandler)
router.get('/getallhotelorpension',getAllHotelOrPension,errorHandler)
router.put('/getallpensionbycity',getAllHotelOrPensionByCity,errorHandler)
router.put('/updatehotelorpensioninfo',updateHotelOrPensionInfo,errorHandler)
router.delete('/deletehotelorpension',deleteHotelOrPension,errorHandler)
//city
router.post('/registercity',registerCity,errorHandler)
router.get('/getallorganizationcity',getAllOrganizationCity,errorHandler)
router.put('/updatecityinfo',updateCityInfo,errorHandler)
router.delete('/deletecity',deleteCity,errorHandler)
//bus
router.post('/registerbus',registerBus,errorHandler)
router.get('/getallorganizationbus',getAllOrganizationBus,errorHandler)
router.put('/updatebusinfo',updateBusInfo,errorHandler)
router.delete('/deletebus',deleteBus,errorHandler)


module.exports = router

