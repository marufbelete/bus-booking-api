const User = require("../models/organizationUser.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//register organization user
exports.saveOrganizationUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const phone_number = req.body.phoneNumber;
    const user_role=req.body.userRole;
    const password=req.body.password;
    const confirm_password=req.body.confirmPassword;
    const organization_code=req.userinfo.organization_code;
    if (!!!name || !!!phone_number || !!!password || !!!user_role) {
      return res.status(400).json({ message: "Please fill all field." })
    }
    const anyphone_number = await User.find({
      phone_number: phone_number,
      user_type: user_type,
    });
    if (anyphone_number.length>0) {
      return res.status(400).json({
        error: true,
        message: "User with this phone number already exist!!!",
      });
    }
    if (password.length < 5) {
      return res.status(400).json({ error: true, message: "the password need to be atleast 5 charcter long." })
    }
    if (password != confirm_password) {
      return res.status(400).json({ error: true, message: "password doesn't match. please try again." })
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      name:name,
      phone_number: phone_number,
      isMobileUser:false,
      userRole:user_role,
      organizationCode:organization_code,
      password: passwordHash,
    })
    await user.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number,user_role:user_role,organization_code:organization_code }, "marufsecret");
    res.json({
      token
    });
  }
  catch {
    res.status(500).json({ err: error.message })
  }
};

//log in organization user
exports.loginOrganizationUser = async (req, res, next) => {
  try {
    const phone_number  = req.body.phonenumber;
    const password=req.body.password
    const organization_code=req.body.organizationCode;
    if (!!!phone_number || !!!password || !!!user_type) {
      return res.status(400).json({ message: "Please fill all field." })
    }
   const user = await User.find({
      phone_number: phone_number,
      organizationCode:organization_code
    });
    if (user.length===0) {
      return res.status(400).json({
        error: true,
        message: "No account with this Phone exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential."});
    }
    const user_role=user.userRole
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number,organization_code:organization_code,user_role:user_role }, "marufsecret");
    res.json({
      token
    });
  }
  catch {
    res.status(500).json({ err: error.message })
  }
};

//update organization user info
exports.updateOrganizationUser = async (req, res, next) => {

  try {
    const name = req.body.name;
    const phone_number = req.body.phoneNumber;
    const password=req.body.password;
    const confirm_password=req.body.confirmPassword;
    const change_role=req.body.userRole;
    const organization_code=req.userinfo.organization_code;
    const user_role=req.userinfo.organization_code;
    if (!!!name || !!!phone_number || !!!password || !!!user_role) {
      return res.status(400).json({ message: "Please fill all field." })
    }
    if (password.length < 5) {
      return res.status(400).json({ error: true, message: "the password need to be atleast 5 charcter long." })
    }
    if (password != confirm_password) {
      return res.status(400).json({ error: true, message: "password doesn't match. please try again." })
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
  const firstadminuser=await User.findOne({userRole:'firstadmin',organizationCode:organization_code})
if(user_role==='firstadmin' || user_role==='admin')
{ 
  if(phone_number!=firstadminuser.phoneNumber){
  const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
  userRole:change_role,
}
  })
  res.json(updateduser)
}
  res.json("you can't change the state of master user")
}
const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
}
  })
res.json(updateduser)  
  }
  catch {
    res.status(500).json({ err: error.message })
  }
};

//delete organization user
exports.deleteOrganizationUser = async (req, res, next) => {
try {
    const deleteduser=req.params.userid
    const organization_code=req.userinfo.organization_code;
    const id=req.userinfo._id;
    const user_role=req.userinfo.organization_code;
  const firstadminuser=await User.findOne({userRole:'firstadmin',organizationCode:organization_code})
if(user_role==='firstadmin' || user_role==='admin')
{ 
if(deleteduser!=firstadminuser._id){ 
  await User.findByIdAndDelete(id)
  res.json("user deleted successfully")
}
  res.json("you can't delete the master user")
}
  }
  catch {
    res.status(500).json({ err: error.message })
  }
};


