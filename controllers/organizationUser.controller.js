const User = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const config = require('../config.json');
const Role=require("../accesscontoller.json")

//register organization user
exports.saveOwner = async (req, res, next) => {
  try {
    const name = req.body.name;
    const phone_number = req.body.phonenumber;
    const add_role=req.body.userrole; 
    const password=req.body.password;
    const confirm_password=req.body.confirmpassword;
    const anyphone_number = await User.findOne({
      phoneNumber: phone_number });
      if(Object.keys(anyphone_number).length !== 0 && anyphone_number.constructor === Object)  {
      const error = new Error("User with this phone number already exist!!!")
      error.statusCode = 400
      throw error;
    }
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    if (password != confirm_password) {
      const error = new Error("password doesn't match. please try again." )
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const owner=new User({
      name:name,
      phoneNumber: phone_number,
      isMobileUser:false,
      userRole:add_role,
      password: passwordHash,
    })
    const user=await owner.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phoneNumber,user_role:user.userRole,is_mobileuser:false }, config.SECRET);
    return res.json(token);

  }
  catch(error)
  {
    next(error)
  }
  }
  //log in owner
  exports.loginOnwer = async (req, res, next) => {
    try {
      const phone_number  = req.body.phonenumber;
      const password=req.body.password
      if (!!!phone_number || !!!password) {
        const error = new Error("Please fill all field." )
        error.statusCode = 400
        throw error;
      }
     const user = await User.findOne({
        phoneNumber: phone_number,
      });
      if(Object.keys(user).length !== 0 && user.constructor === Object) {
        const error = new Error("No account with this Phone exist" )
        error.statusCode = 400
        throw error;
      }
      
      const isMatch = await bcrypt.compare(password, user.password)
      console.log(user)
      if (!isMatch) {
        const error = new Error("Invalid credential.")
        error.statusCode = 400
        throw error;
      }
     
      const token = jwt.sign({ sub: user._id, phone_number: user.phoneNumber,user_role:user.userRole,is_mobileuser:user.isMobileUser }, config.SECRET);
    res.json({
      token
    });
    return res.json(token)
    }
    catch(error) {
      next(error)
       }
  };
  exports.saveSuperadmin = async (req, res, next) => {
    try {
      const name = req.body.name;
      const phone_number = req.body.phonenumber;
      const add_role=req.body.userrole; 
      const password=req.body.password;
      const confirm_password=req.body.confirmpassword;
      const organization_code=req.body.organizationcode;
      const anyphone_number = await User.findOne({
        phoneNumber: phone_number,
        organizationCode:organization_code
      });
      if(Object.keys(anyphone_number).length !== 0 && anyphone_number.constructor === Object) {
        const error = new Error("User with this phone number already exist!!!")
        error.statusCode = 400
        throw error;
      }
      if (password.length < 5) {
        const error = new Error("the password need to be atleast 5 charcter long.")
        error.statusCode = 400
        throw error;
      }
      if (password != confirm_password) {
        const error = new Error("password doesn't match. please try again." )
        error.statusCode = 400
        throw error;
      }
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      const superadmin=new User({
        name:name,
        phoneNumber: phone_number,
        isMobileUser:false,
        userRole:add_role,
        password: passwordHash,
        organizationCode:organization_code
      })
      const thesuperadmin=await superadmin.save()
      return res.json(thesuperadmin)
    }
    catch(error)
    {
      next(error)
    }
    }
exports.saveOrganizationUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const phone_number = req.body.phoneumber;
    const add_role=req.body.userrole; 
    const password=req.body.password;
    const confirm_password=req.body.confirmpassword;
    const organization_code=req.userinfo.organization_code;
if(add_role===Role.SUPERADMIN || add_role===Role.OWNER)
{ 
 const error = new Error("You don't have access to add super admin or owner, please contact your provider" )
  error.statusCode = 400
  throw error;
}
if (!!!name || !!!phone_number || !!!password || !!!add_role) {
  const error = new Error("Please fill all field." )
  error.statusCode = 400
  throw error;
}
    const anyphone_number = await User.findOne({
      phoneNumber: phone_number,
      organizationCode:organization_code
    });
    if(Object.keys(anyphone_number).length !== 0 && anyphone_number.constructor === Object)  {
      const error = new Error("User with this phone number already exist!!!")
      error.statusCode = 400
      throw error;
    }
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    if (password != confirm_password) {
      const error = new Error("password doesn't match. please try again." )
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const user = new User({
      name:name,
      phoneNumber: phone_number,
      isMobileUser:false,
      userRole:add_role,
      organizationCode:organization_code,
      password: passwordHash,
    })
    await user.save()
   return res.json("saved successfully")
  }
  catch(error) {
    next(error)
     }
};

//log in organization user
exports.loginOrganizationUser = async (req, res, next) => {
  try {
    const phone_number  = req.body.phonenumber;
    const password=req.body.password
    const organization_code=req.body.organizationcode;
    if (!!!phone_number || !!!password) {
      const error = new Error("Please fill all field." )
      error.statusCode = 400
      throw error;
    }
   const user = await User.findOne({
      phoneNumber: phone_number,
      organizationCode:organization_code
    });
    if(Object.keys(anyphone_number).length === 0 && anyphone_number.constructor === Object) {
      const error = new Error("No account with this Phone exist" )
      error.statusCode = 400
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error("Invalid credential.")
      error.statusCode = 400
      throw error;
    }
    const user_role=user.userRole
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number,organization_code:organization_code,user_role:user_role,is_mobileuser:false }, config.SECRET);
    res.json({
      token
    });
  }
  catch(error) {
    next(error)
     }
};
//update organization user info
exports.updateOrganizationUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const updateduserid=req.params.id
    const phone_number = req.body.phonenumber;
    const password=req.body.password;
    const confirm_password=req.body.confirmpassword;
    const change_role=req.body.userrole;
    const organization_code=req.userinfo.organization_code;
    const user_role=req.userinfo.organization_code;
    const user_id=req.userinfo.sub;
    if (!!!name || !!!phone_number || !!!password || !!!user_role) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
     }
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    if (password != confirm_password) {
      const error = new Error( "password doesn't match. please try again.")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
if(user_role===Role.SUPERADMIN)
{ 
  //for other
  if(updateduserid!=user_id){
  const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
  userRole:change_role,
}
  })
  return res.json(updateduser)
}
// for itself
else{
  const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
    $set:{
    name:name,
    password:passwordHash,
  }
    })
    return res.json(updateduser)
}
}
if(user_role===Role.ADMIN ){
  //for itself
  const editeduser=await User.findOneById(updateduserid)
  if(updateduserid==user_id)
  { 
    const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
      $set:{
      name:name,
      password:passwordHash,
    }
      })
      return res.json(updateduser)
  }
// for other than admin
  else if(editeduser.userRole!==Role.SUPERADMIN && editeduser.userRole!==Role.ADMIN ){
    const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
      $set:{
      name:name,
      password:passwordHash,
      userRole:change_role,
    }
      })
      return res.json(updateduser)
  }
  const error = new Error( "you can't edit other admin info.")
  error.statusCode = 400
  throw error;

}
const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
}
  })
return res.json(updateduser)  
  }
  catch(error) {
    next(error)
     }
};
//delete organization user
exports.deleteOrganizationUser = async (req, res, next) => {
try {
    const deleteduserid=req.params.id
    const organization_code=req.userinfo.organization_code;
    const id=req.userinfo._id;
    const user_role=req.userinfo.organization_code;
    const superadminuser=await User.findOne({userRole:Role.SUPERADMIN,organizationCode:organization_code})
if(user_role===Role.SUPERADMIN)
{ 
if(deleteduserid==superadminuser._id){ 
  const error = new Error("you can't delete super admin.")
  error.statusCode = 400
  throw error;
}
await User.findByIdAndDelete(id)
return res.json("user deleted successfully")
}
else{
  if(deleteduserid==id)
  { 
    await User.findByIdAndDelete(id)
    return res.json("user deleted successfully")
  }
}
  }
  catch(error) {
    next(error)
     }
};


