const Organization = require("../models/organization.model");

//signup for mobile user
exports.createOrganization = async (req, res, next) => {
  try {
    const orgname = req.body.organizationname;
    const orgcode= req.body.organizationcode;
    const organization = new Organization({
      organizaitonName:orgname,
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
   const code=req.body.organizationcode
   const organization= await Organization.findById(code)
   res.json(organization)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteOrganization = async (req, res, next) => {
  try {
   const deleteid=req.params.userid
   await Organization.findByIdAndDelete(deleteid)
  }
  catch(error) {
    next(error)
  }
};
