const express = require('express');
const userauth = require("../middleware/auth.middleware")
const {authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {refundRequest,cancelPassTicket}= require("../controllers/scheduletransfer.controller")
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();
//schedule
// router.post('/scheduletransferrequest',userauth,authaAdminCasher,scheduleTransferRequest,errorHandler)
// router.put('/acceptscheduletransferrequest',userauth,authAdmin,acceptScheduleTransferRequest,errorHandler)
// router.put('/rejectscheduletransferrequest',userauth,rejectScheduleTransferRequest,errorHandler)
router.put('/refundrequest/:id',userauth,refundRequest,errorHandler)
// router.put('/postponetrip',userauth,postPoneTrip,errorHandler)
router.put('/cancelpassticket/:id',userauth,authaAdminCasherAgent,cancelPassTicket,errorHandler)


module.exports = router

