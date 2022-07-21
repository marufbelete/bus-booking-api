const express = require('express');
const { saveMobileUser,loginMobileUser,updateMobileUser } = require('../controllers/mobileUser.controller');
const {saveOwner,loginOnwer,saveSuperadmin,changePassword,saveOrganizationUser,loginOrganizationUser,updateOrganizationUser,deactivateOrganizationUser,activateOrganizationUser,getAllOrganizationUser, getUserByRole, checkAuth, getAllOrganizationDriver, tempResetPassword} = require('../controllers/organizationUser.controller');
const {createRole,getRole,deleteRole}=require('../controllers/manageRole.controller')
const userauth = require("../middleware/auth.middleware")
const {authOwner,authSuperAdmin,authAdmin,authaAdminCasher,authaAdminCasherAgent} = require("../middleware/authadmin.middleware")
const {errorHandler} = require('../middleware/errohandling.middleware')
const router = express.Router();

// owner
router.post('/registerowner',saveOwner,errorHandler)
router.post('/loginowner',loginOnwer,errorHandler)

// superadmin
router.post('/registersuperadmin',userauth,authOwner,saveSuperadmin,errorHandler)

//mobile user 
router.post('/registermobileuser', saveMobileUser,errorHandler)
router.get('/checkauth',checkAuth,errorHandler)
router.post('/loginmobileuser',loginMobileUser,errorHandler)
router.put('/updatemobileuser/:id',userauth, updateMobileUser,errorHandler)

//organization user 
router.post('/registerorganizationuser',userauth,authAdmin,saveOrganizationUser,errorHandler)
router.post('/loginorganizationuser', loginOrganizationUser,errorHandler)
router.put('/updateorganizationuser/:id',userauth ,authaAdminCasherAgent,updateOrganizationUser,errorHandler)
router.put('/deactivateorganizationuser/:id',userauth,authAdmin,deactivateOrganizationUser,errorHandler)
router.put('/activateorganizationuser/:id',userauth,authAdmin,activateOrganizationUser,errorHandler)
router.get('/getallorganizationuser',userauth,authaAdminCasher,getAllOrganizationUser,errorHandler)
router.get('/getallorganizationdriver',userauth,authaAdminCasher,getAllOrganizationDriver,errorHandler)
router.get('/getuserbyrole',userauth,authaAdminCasher,getUserByRole,errorHandler)
router.put('/changepassword',userauth,changePassword,errorHandler)
router.put('/resetpassword:/id',userauth,tempResetPassword,errorHandler)

//role
router.post('/createrole',userauth,authAdmin, createRole,errorHandler)
router.post('/getroles',userauth,authaAdminCasherAgent,getRole,errorHandler)
router.put('/deleterole/:id',userauth, authAdmin,deleteRole,errorHandler)



module.exports = router

