const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {getAllSchedule,getAllCanceledSchedule,getAllActiveSchedule,getAllActiveScheduleInRoute,myBookedTicketList,myPassangerList}= require("../controllers/dashboard.controller")
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();
//schedule
router.get('/getallschedule',userauth,authAdmin,getAllSchedule,errorHandler)
router.get('/getallactiveschedule',userauth,getAllActiveSchedule,errorHandler)
router.get('/getallcanceledschedule',userauth,getAllCanceledSchedule,errorHandler)
router.get('/getallactivescheduleinroute',userauth,getAllActiveScheduleInRoute,errorHandler)
router.get('/mybookedticket',userauth,myBookedTicketList,errorHandler)
router.get('/mypassanger',userauth,myPassangerList,errorHandler)

module.exports = router

