const Role = require("../models/role.model");

//signup for mobile user
exports.createRole = async (req, res, next) => {
  try {
    const user_role = req.body.userRole;
    const role = new Role({
    roleType:user_role   
    })
    const addedrole=await role.save()
    res.json(addedrole)
  }
catch(error) {
next(error);
  }
};
//log in mobile user
exports.getRole = async (req, res, next) => {
  try {
   const role= await Role.find()
   res.json(role)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteRole = async (req, res, next) => {
  try {
   const deleteid=req.params.userid
   await Role.findByIdAndDelete(deleteid)
  }
  catch(error) {
    next(error)
  }
};
