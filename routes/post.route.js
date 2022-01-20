const express = require('express');
const userauth = require("../middleware/auth.middleware")
const { createPost,getPost,updatePostStatus,deletePost,updatePost } = require('../controllers/post.controller')
const {createCatagory,getCatgory,updateCatagory,deleteCatagory} = require('../controllers/catagory.controller')
const {createLocation,getLocation,updateLocation,deleteLocation,getCity,getSubcity,getVillage} = require('../controllers/location.controller')
const {addUssdCode,getUssdCode,updateUssdCode,deleteUssdCode,}=require('../controllers/payment.controller')
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

//post
router.post('/createpost', userauth,upload.array('image',6),createPost)
router.get('/getpost/:firstcatagory/:secondcatagory/:thiredcatgory', userauth,getPost)
router.put('/updatepost/:id',upload.array('image',6), userauth,updatePost)
router.put('/updatepoststatus/:id', userauth,updatePostStatus)
router.delete('/deletepost/:id', userauth,deletePost)

//catagory
router.post('/createcatagory', userauth,upload.single('image'),createCatagory)
router.get('/getcatagory', userauth,getCatgory)
router.put('/updatecatagory/:id',upload.single('image'), userauth,updateCatagory)
router.delete('/deletecatagory/:id', userauth,deleteCatagory)

//location
router.post('/addlocation', userauth,createLocation)
router.get('/getlocation', userauth,getLocation)
router.get('/getcity', userauth,getCity)
router.get('/getsubcity', userauth,getSubcity)
router.get('/getvillage/:city', userauth,getVillage)
router.put('/updatelocation/:id', userauth,updateLocation)
router.delete('/deletelocation/:id', userauth,deleteLocation)
//ussd code
router.post('/createussdcode', userauth,addUssdCode)
router.get('/getussdcode', userauth,getUssdCode)
router.put('/updateussdcode/:id', userauth,updateUssdCode)
router.delete('/deleteussdcode/:id', userauth,deleteUssdCode)

module.exports = router

