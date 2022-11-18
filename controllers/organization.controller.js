const Organization = require("../models/organization.model");
const fs=require('fs')
const sharp=require('sharp');
const { convertToDotNotation } = require("../helpers/todot");
exports.createOrganization = async (req, res, next) => {
  try {
const {organizationName,organizationCode,organizationNameAmharic,
  branch,tin,offering,setting,rulesAndRegulation
}=req.body
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
          .resize({ width:600, fit: 'contain' })
    .toFormat(imagetype)
    .toFile(`${process.cwd()}/images/${fullpath}`);
    imgurl=fullpath
}
    const organization = new Organization({
      organizationCode,
      organizationName,
      organizationNameAmharic,
      branch,
      tin,
      setting,
      rulesAndRegulation,
      offering,
      logo:imgurl
    })
    const savedorg=await organization.save()
    return res.json(savedorg)
  }
catch(error) {
next(error);
  }
};
//get all organization
exports.getAllOrganization = async (req, res, next) => {
  try {
   const allorganization= await Organization.find()
   return res.json(allorganization)
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
   return res.json(organization)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id include org access
exports.getOrganizationByCode = async (req, res, next) => {
  try {
   const code=req.params.code
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
    return res.json(organization)
  }
  catch(error) {
    next(error)
  }
};
//get refund percent
exports.getOrgRules = async (req, res, next) => {
  try {
    const orgcode =req.userinfo.organization_code;
    const org_rule= await Organization.findOne({organizationCode:orgcode},
      {rulesAndRegulation:1})
    return res.json(org_rule)
  }
  catch(error) {
    next(error)
  }
};
//update organization  //add here
exports.updateBrnach=async (req,res,next)=>{
  try{
const orgId=req.params.id
const {description,location,responsiblePerson,contactInfo,branchId}=req.body
let opt={}
if(description){opt={"branch.$[el].description":description}}
if(location){opt={...opt,"branch.$[el].location":location}}
if(responsiblePerson){opt={...opt,"branch.$[el].responsiblePerson":responsiblePerson}}
if(contactInfo){opt={...opt,"branch.$[el].contactInfo":contactInfo}}

const organization=await Organization.findByIdAndUpdate(orgId,{$set:{...opt}},
{arrayFilters:[{"el._id":branchId}],new:true,useFindAndModify:false})

return res.json(organization)
}

catch(error) {
  next(error)
}
}

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
let branch_push={}
let offer_push={}
let schedule_push={}
let fund_push={}
let bank_push={}
let user_push={}
let route_push={}
let regulation_push={}
if(updateObj.branch){
  delete updateObj.branch
  branch_push={branch:req.body.branch}
}
if(updateObj.offering){
  offer_push={offering:req.body.offering}
  delete updateObj.offering
}

if(updateObj?.setting?.funding){
  fund_push={'setting.funding':req.body.setting.funding}
}
if(updateObj?.setting?.bank){
  bank_push={'setting.bank':req.body.setting.bank}
}
if(updateObj?.setting?.schedule){
  schedule_push={'setting.schedule':req.body.setting.schedule}
}
if(updateObj?.setting?.user){
  user_push={'setting.user':req.body.setting.user}
}
if(updateObj?.setting?.route){
  route_push={'setting.route':req.body.setting.route}
}
if(updateObj?.rulesAndRegulation){
  regulation_push={rulesAndRegulation:req.body.rulesAndRegulation}
  delete updateObj.rulesAndRegulation
}
delete updateObj.setting
updateObj=convertToDotNotation(updateObj)
if(imgurl){updateObj.logo=imgurl}
   const organization= await Organization.findByIdAndUpdate(id,
    { 
      $set:{
        ...updateObj
      
      },
     $addToSet:{...branch_push,...bank_push,...offer_push,...user_push,
    ...route_push,...regulation_push,...schedule_push,...fund_push}
    ,
      

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
