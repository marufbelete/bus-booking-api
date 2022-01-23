const Role = require("../models/role.model");

//signup for mobile user
exports.createRole = async (req, res, next) => {
  try {
    const role = req.body.userRole;
    const role = new Role({
    roleType:role    
    })
    await role.save()
  res.json("User saved successfully")
  }
catch {
    res.status(500).json({ err: error.message })
  }
};

//log in mobile user
exports.getRole = async (req, res, next) => {
  try {
   const role= await Role.find()
   res.json(role)
  }
  catch {
    res.status(500).json({ err: error.message })
  }
};

exports.deleteRole = async (req, res, next) => {
  try {
    
    const deleteid=req.params.userid
   await Role.findByIdAndDelete(deleteid)

  }
  catch {
    res.status(500).json({ err: error.message })
  }
};
