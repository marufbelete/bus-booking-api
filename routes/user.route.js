const express = require('express');
const { saveMobileUser,loginMobileUser,updateMobileUser } = require('../controllers/mobileUser.controller');
const {saveOrganizationUser,loginOrganizationUser,updateOrganizationUser,deleteOrganizationUser } = require('../controllers/organizationUser.controller');
const {createRole,getRole,deleteRole}=require('../controllers/manageRole.controller')
const userauth = require("../middleware/auth.middleware")
const router = express.Router();

//user 
router.post('/registermobileuser', saveMobileUser)
router.post('/registermobileuser',userauth ,saveMobileUser)
router.post('/registermobileuser', saveMobileUser)
router.post('/registermobileuser',userauth ,saveMobileUser)
router.post('/registermobileuser', saveMobileUser)
router.post('/registermobileuser',userauth ,saveMobileUser)

router.post('/login', loginUser)


module.exports = router

