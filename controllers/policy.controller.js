const Policy = require("../models/bus.model");

exports.addPolicy = async (req, res, next) => {
  try {
    const title = req.body.title;
    const description= req.body.description;
    const created_by =req.userinfo.sub;
    const orgcode =req.userinfo.organization_code;
if(!!title && !!description)
{ 
    const newbus= new Policy({
      title:title,
      description:description,
      createdBy:created_by,
      organizationCode:orgcode,
    })
    const savedpolicy=await newbus.save()
    return res.json(savedpolicy)
  }
  const error = new Error("please fill all field")
  error.statusCode = 400
  throw error;
  }
catch(error) {
next(error);
  }
};
//get policy
exports.getPolicy= async (req, res, next) => {
  try {
  const orgcode =req.userinfo.organization_code;
  const allpolicy= await Policy.find({organizationCode:orgcode})
  return res.json(allpolicy)
  }
  catch(error) {
    next(error)
  }
};
//get update policy
exports.updatePolicyInfo = async (req, res, next) => {
  try {
    const id=req.params.id
    const title = req.body.title;
    const description= req.body.description;
    const created_by =req.userinfo.sub;
    const bus= await Policy.findAndUpdateById(id,{
     $set:{
      title:title,
      description:description,
      createdBy:created_by,
     }
   })
   return res.json(bus)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deletePolicy = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Policy.findByIdAndDelete(deleteid)
   return res.json({message:"deleted successfully",success:true})
  }
  catch(error) {
    next(error)
  }
};
