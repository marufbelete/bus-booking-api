const express = require('express');
const userauth = require("../middleware/auth.middleware")
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


module.exports = router

