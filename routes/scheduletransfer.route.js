const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {scheduleTransferRequest,acceptScheduleTransferRequest,rejectScheduleTransferRequest,postPoneTrip}= require("../controllers/scheduletransfer.controller")
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();
//schedule
// router.post('/scheduletransferrequest',userauth,authaAdminCasher,scheduleTransferRequest,errorHandler)
// router.put('/acceptscheduletransferrequest',userauth,authAdmin,acceptScheduleTransferRequest,errorHandler)
// router.put('/rejectscheduletransferrequest',userauth,rejectScheduleTransferRequest,errorHandler)
// router.put('/postponetrip',userauth,postPoneTrip,errorHandler)
//teset
router.post('/scheduletransferrequest',scheduleTransferRequest,errorHandler)
router.put('/acceptscheduletransferrequest',acceptScheduleTransferRequest,errorHandler)
router.put('/rejectscheduletransferrequest',rejectScheduleTransferRequest,errorHandler)
router.put('/postponetrip',postPoneTrip,errorHandler)

module.exports = router

