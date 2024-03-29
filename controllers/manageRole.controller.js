const Role = require("../models/role.model");

//signup for mobile user
exports.createRole = async (req, res, next) => {
  try {
    const user_role = req.body.userRole;
    const role = new Role({
    roleType:user_role   
    })
    const addedrole=await role.save()
    return res.json(addedrole)
  }
catch(error) {
next(error);
  }
};
//log in mobile user
exports.getRole = async (req, res, next) => {
  try {
   const role= await Role.find()
   return res.json(role)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteRole = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Role.findByIdAndDelete(deleteid)
   return res.json({message:"role deleted success",status:true})
  }
  catch(error) {
    next(error)
  }
};
