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
      if(anyphone_number)  {
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
      if (!phone_number || !password) {
        const error = new Error("Please fill all field." )
        error.statusCode = 400
        throw error;
      }
     const user = await User.findOne({
        phoneNumber: phone_number,
      });
      if(!user) {
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
      const saved_by=req.userinfo.sub
      const anyphone_number = await User.findOne({
        phoneNumber: phone_number,
      });
      console.log(anyphone_number)
      if(anyphone_number) {
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
        organizationCode:organization_code,
        createdBy:saved_by
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
    const phone_number = req.body.phonenumber;
    const add_role=req.body.userrole; 
    const password=req.body.password;
    const confirm_password=req.body.confirmpassword;
    const organization_code=req.userinfo.organization_code;
    const saved_by=req.userinfo.sub
    console.log(organization_code)
if(add_role===Role.SUPERADMIN || add_role===Role.OWNER)
{ 
 const error = new Error("You don't have access to add super admin or owner, please contact your provider" )
  error.statusCode = 400
  throw error;
}
console.log(req.body)
if (!name || !phone_number || !password || !add_role) {
  const error = new Error("Please fill all field." )
  error.statusCode = 400
  throw error;
}
    const anyphone_number = await User.findOne({
      phoneNumber: phone_number,
    });
    console.log(anyphone_number)
    if(anyphone_number)  {
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
      createdBy:saved_by
    })
  const neworguser=await user.save()
   return res.json(neworguser)
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
   
    if (!phone_number || !password || !organization_code) {
      const error = new Error("Please fill all field." )
      error.statusCode = 400
      throw error;
    }
   const user = await User.findOne({
      phoneNumber: phone_number,
      organizationCode:organization_code,
    });
    if(!user) {
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
    const user_role=req.userinfo.user_role;
    const user_id=req.userinfo.sub;
    if (!name || !phone_number || !password || !user_role) {
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
//owner

if(user_role===Role.OWNER)
{
  const error = new Error( "you can't change owner info please contact you provider.")
  error.statusCode = 400
  throw error;
 }

//super admin
if(user_role===Role.SUPERADMIN)
{ 
  //for other
  if(updateduserid!==user_id){
  const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
  userRole:change_role,
}
  },{useFindAndModify:false})
  return res.json(updateduser)
}
// for itself
else{
  const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
    $set:{
    name:name,
    password:passwordHash,
  }
    },{useFindAndModify:false,new:true})
    return res.json(updateduser)
}
}

const editeduser=await User.findById(updateduserid)
//admin
if(user_role===Role.ADMIN ){
  //for itself
  if(updateduserid===user_id)
  { 
    const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
      $set:{
      name:name,
      password:passwordHash,
    }
      },{useFindAndModify:false,new:true})
      return res.json(updateduser)
  }
// for other than like casher
  else if(editeduser.userRole!==Role.SUPERADMIN && editeduser.userRole!==Role.ADMIN ){
    console.log("in")
    const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
      $set:{
      name:name,
      password:passwordHash,
      userRole:change_role,
    }
      },{useFindAndModify:false,new:true})
      return res.json(updateduser)
  }
  const error = new Error( "you can't edit other admin or superadmin info.")
  error.statusCode = 400
  throw error;

}

if(user_id===updateduserid)
{
const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
  $set:{
  name:name,
  password:passwordHash,
}
  },{useFindAndModify:false,new:true})
return res.json(updateduser)  
  }
  const error = new Error( "you can't edit others info.")
  error.statusCode = 400
  throw error;
}
  catch(error) {
    next(error)
     }
};
//delete organization user
exports.deactivateOrganizationUser = async (req, res, next) => {
try {
    const updateduserid=req.params.id
    const organization_code=req.userinfo.organization_code;
    const id=req.userinfo._id;
    const user_role=req.userinfo.organization_code;
    const superadminuser=await User.findOne({userRole:Role.SUPERADMIN,organizationCode:organization_code})
if(user_role===Role.SUPERADMIN || user_role===Role.ADMIN)
{ 
if(updateduserid==superadminuser._id){ 
  const error = new Error("you can't change status of superadmin user.")
  error.statusCode = 400
  throw error;
}
  await User.findByIdAndUpdate(id,{
    isActive:false
  })
  return res.json("user deleted successfully")
}
const error = new Error("you can't delete superadmin.")
error.statusCode = 400
throw error;
  
  }
  catch(error) {
    next(error)
     }
};

exports.activateOrganizationUser = async (req, res, next) => {
  try {
      const updateduserid=req.params.id
      const organization_code=req.userinfo.organization_code;
      const id=req.userinfo._id;
      const user_role=req.userinfo.organization_code;
      const superadminuser=await User.findOne({userRole:Role.SUPERADMIN,organizationCode:organization_code})
  if(user_role===Role.SUPERADMIN || user_role===Role.ADMIN)
  { 
  if(updateduserid==superadminuser._id){ 
    const error = new Error("you can't change status of superadmin user.")
    error.statusCode = 400
    throw error;
  }
    await User.findByIdAndUpdate(id,{
      isActive:true
    })
    return res.json("user deleted successfully")
  }
  const error = new Error("you can't delete superadmin.")
  error.statusCode = 400
  throw error;
    
    }
    catch(error) {
      next(error)
       }
  };


