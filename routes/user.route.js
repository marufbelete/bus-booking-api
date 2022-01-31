const express = require('express');
const { saveMobileUser,loginMobileUser,updateMobileUser } = require('../controllers/mobileUser.controller');
const {saveOrganizationUser,loginOrganizationUser,updateOrganizationUser,deleteOrganizationUser } = require('../controllers/organizationUser.controller');
const {createRole,getRole,deleteRole}=require('../controllers/manageRole.controller')
const userauth = require("../middleware/auth.middleware")
const {authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();

//mobile user 
router.post('/registermobileuser', saveMobileUser,errorHandler)
router.post('/loginmobileuser',loginMobileUser,errorHandler)
router.put('/updatemobileuser',userauth, updateMobileUser,errorHandler)
//organization user 
router.post('/registerorganizationuser',userauth,authAdmin,saveOrganizationUser,errorHandler)
router.post('/loginorganizationuser', loginOrganizationUser,errorHandler)
router.put('/updateorganizationuser',userauth ,authaAdminCasherAgent,updateOrganizationUser,errorHandler)
router.delete('/deleteorganizationuser',userauth,authAdmin ,deleteOrganizationUser,errorHandler)
//role



module.exports = router

