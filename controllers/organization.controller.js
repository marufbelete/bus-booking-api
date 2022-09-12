const Organization = require("../models/organization.model");
const fs=require('fs')
const sharp=require('sharp')
//signup for mobile user
exports.createOrganization = async (req, res, next) => {
  try {
const {organizationName,organizationCode,branchName,organizationNameAmharic,funding}=req.body
let imgurl
if (req.file)
    {
        if (!fs.existsSync(`${process.cwd()}/images`)){
            fs.mkdirSync(`${process.cwd()}/images`);
        }
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const imagetype=(req.file.mimetype).split("/")[1];
    const path=req.file.originalname;
    const fullpath=uniquePrefix+'-'+path;
           sharp(req.file.buffer)
          .resize({ width:600, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`${process.cwd()}/images/${fullpath}`);
    imgurl=fullpath
}
    const organization = new Organization({
      organizationCode,
      organizationName,
      organizationNameAmharic,
      rulesAndRegulation:{funding},
      $push:{branch:branchName},
      logo:imgurl
    })
    const savedorg=await organization.save()
    res.json(savedorg)
  }
catch(error) {
next(error);
  }
};
//get all organization
exports.getAllOrganization = async (req, res, next) => {
  try {
   const allorganization= await Organization.find()
   res.json(allorganization)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id
exports.getOrganizationById = async (req, res, next) => {
  try {
   const id=req.params.id
   const organization= await Organization.findById(id)
   res.json(organization)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id include org access
exports.getOrganizationByCode = async (req, res, next) => {
  try {
   const code=req.body.code
   const organization= await Organization.findOne({organizationCode:code})
   if(organization)
   {
    return res.json(organization)
   }
   const error = new Error("This organization code does not exist.")
   error.statusCode = 400
   throw error;
  }
  catch(error) {
    next(error)
  }
};
//get my organization
exports.getMyOrganization = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
    const organization= await Organization.findOne({organizationCode:orgcode})
   if(organization)
   {
    return res.json(organization)
   }
   const error = new Error("This organization code does not exist.")
   error.statusCode = 400
   throw error;
  }
  catch(error) {
    next(error)
  }
};
//update organization
exports.updateOrganization = async (req, res, next) => {
  try {
   const id=req.params.id
   let updateObj = {};

for(let [key, value] of Object.entries(req.body)){
    if(value !== undefined){
        updateObj[key] = value;
    }
}
  let imgurl
if (req.file)
    {
        if (!fs.existsSync(`${process.cwd()}/images`)){
            fs.mkdirSync(`${process.cwd()}/images`);
        }
    const uniquePrefix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const imagetype=(req.file.mimetype).split("/")[1];
    const path=req.file.originalname;
    const fullpath=uniquePrefix+'-'+path;
           sharp(req.file.buffer)
          .resize({ width:600, fit: 'contain', })
    .toFormat(imagetype)
    .toFile(`${process.cwd()}/images/${fullpath}`);
    imgurl=fullpath
}
if(updateObj.funding){
  updateObj.rulesAndRegulation={funding:updateObj.funding}
  delete updateObj.funding
}
if(imgurl){updateObj.logo=imgurl}
   const organization= await Organization.findByIdAndUpdate(id,
    { 
      $set:{
        ...updateObj,
      
      }
    },{new:true,useFindAndModify:false})
   res.json(organization)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteOrganization = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Organization.findByIdAndDelete(deleteid)
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};
