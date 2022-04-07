const Organization = require("../models/organization.model");

//signup for mobile user
exports.createOrganization = async (req, res, next) => {
  try {
    const orgname = req.body.organizationname;
    const orgcode= req.body.organizationcode;
    const organization = new Organization({
      organizationName:orgname,
      organizationCode:orgcode  
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
   const code=req.params.code
   console.log(code)
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
//update organization
exports.updateOrganization = async (req, res, next) => {
  try {
   const id=req.params.id
   const org_name=req.body.organizationname
   const organization= await Organization.findByIdAndUpdate(id,
    { 
      $set:{
        organizaitonName:org_name}
    },{new:true})
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
