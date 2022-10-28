const User = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const Bus = require("../models/bus.model");
const Agent = require("../models/agent.model");

exports.checkAuth = (req, res, next) => {
  try{
  const token =req.cookies.access_token;
  if (token) {
    jwt.verify(token,process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({msg:"you don't have permission please login first",status:false });
      }
      return res.json({message:"ok"});
    });
  }
  else {
    return res.status(403).json({message:"no token"});
  }
}
catch(error)
  {
    next(error)
  }
};
//register organization user
exports.saveOwner = async (req, res, next) => {
  try {
    const first_name = req.body.firstname;
    const last_name = req.body.lastname;
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
      firstName:first_name,
      lastName:last_name,
      phoneNumber: phone_number,
      isMobileUser:false,
      userRole:add_role,
      password: passwordHash,
    })
    const user=await owner.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phoneNumber,user_role:user.userRole,is_mobileuser:false }, process.env.SECRET);
    // res.cookie('token',token,{httpOnly:true, sameSite:'strict'});
    return res.cookie("access_token",token,{
      sameSite:'none',
      path:'/',
      secure:true}).json({auth:true,token})

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
      if (!isMatch) {
        const error = new Error("Invalid credential.")
        error.statusCode = 400
        throw error;
      }
     
      const token = jwt.sign({ sub: user._id, phone_number: user.phoneNumber,user_role:user.userRole,is_mobileuser:user.isMobileUser }, process.env.SECRET);
    // res.cookie('token',token,{httpOnly:true, sameSite:'strict'})
    return res.cookie("access_token",token,{
      sameSite:'none',
      path:'/',
      secure:true}).json({auth:true,token})
    }
    catch(error) {
      next(error)
       }
  };
  exports.saveSuperadmin = async (req, res, next) => {
    try {
      const first_name = req.body.firstname;
      const last_name = req.body.lastname;
      const phone_number = req.body.phonenumber;
      const add_role=req.body.userrole; 
      const password=req.body.password;
      const confirm_password=req.body.confirmpassword;
      const organization_code=req.userinfo.organization_code;
      const saved_by=req.userinfo.sub
      const anyphone_number = await User.findOne({
        phoneNumber: phone_number,
      });
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
        firstName:first_name,
        lastName:last_name,
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
    const first_name = req.body.firstname;
    const last_name = req.body.lastname;
    const phone_number = req.body.phonenumber;
    const add_role=req.body.userrole; 
    const password=req.body.password;
    const gender=req.body.gender;
    const confirm_password=req.body.confirmpassword;
    const organization_code=req.userinfo.organization_code;
    const saved_by=req.userinfo.sub
    const user_role=req.userinfo.user_role
    const branchId=req.user.branch
    const isAssigned=(add_role==process.env.DRIVER||add_role==process.env.REDAT)?
    process.env.UNASSIGNEDUSER:process.env.DEFAULTUSER
console.log(typeof isAssigned)
if(add_role===process.env.SUPERADMIN || add_role===process.env.OWNER)
{ 
 const error = new Error("You don't have access to add super admin or owner, please contact your provider" )
  error.statusCode = 400
  throw error;
}

if (!first_name||!last_name || !phone_number || !password || !confirm_password || !add_role) {
  const error = new Error("Please fill all field." )
  error.statusCode = 400
  throw error;
}
    const anyphone_number = await User.findOne({
      phoneNumber: phone_number,
    });
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
    const user_to_add={
      firstName:first_name,
      lastName:last_name,
      phoneNumber: phone_number,
      isMobileUser:false,
      userRole:add_role,
      isAssigned:isAssigned,
      organizationCode:organization_code,
      password: passwordHash,
      createdBy:saved_by,
      gender:gender,
      branch:branchId
    }
    if(add_role===process.env.CASHERAGENT||add_role===process.env.SUPERAGENT)
    {
      const user= await User.findById(saved_by)
      let agent_obj
      let totaluser
      if(add_role===process.env.SUPERAGENT)
      {
      const {agentName,phoneNumber,tin,maxUser,location,isActive}=req.body;
      const newagent= new Agent({
          agentName,
          phoneNumber,
          tin,
          maxUser,
          location,
          isActive,
          organizationCode:organization_code,
      })
      const isAgentExist=await Agent.findOne({tin:tin})
      if(isAgentExist)
      {
    const error = new Error("Agent with is tin already exist.")
    error.statusCode = 400
    throw error;
      }
      const newAgent=await newagent.save()
      user_to_add.agentId=newAgent._id

    }
    else{
      agent_obj=await Agent.findById(user.agentId)
      totaluser=User.find({agentId:user.agentId})
      user_to_add.agentId=user.agentId

    }

      if(add_role===process.env.CASHERAGENT&&!(user_role===process.env.SUPERAGENT))
      {
        return res.json({message:"you don't have access to register casher agent!!"})
      }
      if(add_role===process.env.CASHERAGENT&&totaluser.length-1>=agent_obj.maxUser)
      {
        return res.json({message:"you reached maximum account creation limit. please contact your provider for more info"})
      }
    }
    const user = new User(user_to_add)
    const neworguser=await user.save()
  if(add_role===process.env.SUPERAGENT)
{
  const agentId=req.body.agentId
  await Agent.findByIdAndUpdate(agentId,{set:{isAcountExist:true}})
}
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
    const fullName=user.firstName+" "+user.lastName[0]+"."

    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number,organization_code:organization_code,user_role:user_role,is_mobileuser:false }, process.env.SECRET);
    return res.status(202).cookie("access_token",token,{
      sameSite:'none',
      path:'/',
      secure:true
    }).json({
        auth:true,
        user:fullName,
        role:user_role,
        token
      })
  }
  catch(error) {
    next(error)
     }
};
//get all casher user
exports.getAllOrganizationUser= async(req,res,next) =>{
try{
  const organization_code=req.userinfo.organization_code;
  const user_role=req.userinfo.user_role
  if(user_role===process.env.SUPERADMIN)
  {
   const alluser=await User.find({organizationCode:organization_code,userRole:{ $nin:[process.env.SUPERADMIN,process.env.OWNER,process.env.CASHERAGENT]},isMobileUser:false})
   return res.json(alluser)
  //  User.paginate({organizationCode:organization_code,...search,...filter,userRole:{ $nin:[process.env.SUPERADMIN,process.env.OWNER]},isMobileUser:false}, options, function (err, result) {
  //   console.log(result)
  //   return res.json(result)
  // });
  // return;
  }
  if(user_role===process.env.ADMIN)
  {
    // User.paginate({userRole:{$in:[process.env.CASHER,process.env.DRIVER,process.env.AGENT,process.env.REDAT]},
    //   organizationCode:organization_code,...search,...filter,isMobileUser:false}, options, function (err, result) {
    //     console.log(result)
    //     return res.json(result)
    // });
    // return;
    const allcasher=await User.find({userRole:{$in:[process.env.CASHER,process.env.DRIVER,process.env.AGENT,process.env.REDAT]},
    organizationCode:organization_code,isMobileUser:false})
    return res.json(allcasher)
  }
  if(user_role===process.env.CASHER)
  {
    // User.paginate({userRole:{$in:[process.env.DRIVER,process.env.REDAT]},
    //   organizationCode:organization_code,...search,...filter,isMobileUser:false}, options, function (err, result) {
    //   console.log(result)
    //   return res.json(result)
    // });
    // return;
    const all=await User.find({userRole:{$in:[process.env.DRIVER,process.env.REDAT]},
    organizationCode:organization_code,isMobileUser:false})
    return res.json(all)
  }
  if(user_role===process.env.SUPERAGENT)
  {
    // User.paginate({userRole:{$in:[process.env.DRIVER,process.env.REDAT]},
    //   organizationCode:organization_code,...search,...filter,isMobileUser:false}, options, function (err, result) {
    //   console.log(result)
    //   return res.json(result)
    // });
    // return;
    const all=await User.find({userRole:process.env.CASHERAGENT,
    organizationCode:organization_code,isMobileUser:false})
    console.log(all)
    return res.json(all)
  }
}
catch(error) {
  next(error)
}

}
//get all organization user 
exports.getAllOrganizationDriver= async(req,res,next) =>{
  try{
    const organization_code=req.userinfo.organization_code;
    const driver=await User.find({userRole:process.env.DRIVER,organizationCode:organization_code,isMobileUser:false,isActive:true})
     return res.json(driver)
  }
  catch(error) {
    next(error)
  }
}
//update organization user info
exports.updateOrganizationUser = async (req, res, next) => {
  try {
    const {user_role,sub}=req.userinfo
    const {firstName,gender,isActive,lastName,organization_code,id:updateduserid,phoneNumber,userRole,isAssigned}=req.body
    const update_opt={}
    if(firstName){update_opt.firstName=firstName}
    if(gender){update_opt.gender=gender}
    if(lastName){update_opt.lastName=lastName}
    if(isActive){update_opt.isActive=isActive}
    if(phoneNumber){update_opt.phoneNumber=phoneNumber}
    if(userRole){update_opt.userRole=userRole}
    if(isAssigned){update_opt.isAssigned=isAssigned}

//super admin
if(user_role===process.env.SUPERADMIN)
{ 
  //for other
  if(updateduserid!==sub){
    if(isAssigned==process.env.UNASSIGNEDUSER)
    {
    const u_user=await User.findById(updateduserid)
    let filter={}
    let setVal={}
    u_user.userRole==process.env.DRIVER?filter={driverId:updateduserid}:filter={redatId:updateduserid}
    u_user.userRole==process.env.DRIVER?setVal={driverId:null}:setVal={redatId:null}
    await Bus.findOneAndUpdate({...filter,organizationCode:organization_code},{$set:{...setVal}})
    }
  const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
  $set:{
  ...update_opt
}
  },{useFindAndModify:false})
  return res.json(updateduser)
}
// for itself
else{
  const update_opt={}
    if(firstName){update_opt.firstName=firstName}
    if(gender){update_opt.gender=gender}
    if(lastName){update_opt.lastName=lastName}
    if(isActive){update_opt.isActive=isActive}
  const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
    $set:{
   ...update_opt
  }
    },{useFindAndModify:false,new:true})
    return res.json(updateduser)
}
}

const editeduser=await User.findById(updateduserid)
//admin
if(user_role===process.env.ADMIN )
{
  //for itself
  if(updateduserid===sub)
  { 
    const update_opt={}
    if(firstName){update_opt.firstName=firstName}
    if(gender){update_opt.gender=gender}
    if(lastName){update_opt.lastName=lastName}
    if(isAssigned){update_opt.isAssigned=isAssigned}
    const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
      $set:{
     ...update_opt
    }
      },{useFindAndModify:false,new:true})
      return res.json(updateduser)
  }
// for other than like casher
  else if(editeduser.userRole!==process.env.SUPERADMIN && editeduser.userRole!==process.env.ADMIN&&editeduser.userRole!==process.env.OWNER ){
    if(isAssigned==process.env.UNASSIGNEDUSER)
    {
    const u_user=User.findById(updateduserid)
    let filter={}
    let setVal={}
    u_user.userRole==process.env.DRIVER?filter={driverId:updateduserid}:filter={redatId:updateduserid}
    u_user.userRole==process.env.DRIVER?setVal={driverId:null}:filter={redatId:null}
    await Bus.updateMany({...filter,organizationCode:organization_code},{$set:{...setVal}})
    }
    const update_opt={}
    if(firstName){update_opt.firstName=firstName}
    if(gender){update_opt.gender=gender}
    if(lastName){update_opt.lastName=lastName}
    if(isAssigned){update_opt.isAssigned=isAssigned}
    if(isActive){update_opt.isActive=isActive}
    if(userRole){update_opt.userRole=userRole}
      const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
      $set:{
       ...update_opt
    }
      },{useFindAndModify:false,new:true})
      return res.json(updateduser)
  }
  const error = new Error( "you can't edit other admin or superadmin info.")
  error.statusCode = 400
  throw error;

}
const updateduser=await User.findOneAndUpdate({_id:updateduserid,organizationCode:organization_code},{
  $set:{
    isActive:isActive,
}
  },{useFindAndModify:false,new:true})
  return res.json(updateduser)
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
    const user_role=req.userinfo.user_role
    const superadminuser=await User.findOne({userRole:process.env.SUPERADMIN,organizationCode:organization_code})
if(user_role===process.env.SUPERADMIN || user_role===process.env.ADMIN)
{ 
if(updateduserid==superadminuser._id){ 
  const error = new Error("you can't change status of superadmin user.")
  error.statusCode = 400
  throw error;
}
  await User.findByIdAndUpdate(id,{
    isActive:false
  })
  return res.json("user removed successfully")
}
const error = new Error("you don't have privilage to chage user status.")
error.statusCode = 400
throw error;
  
  }
  catch(error) {
    next(error)
     }
};
exports.getUserByRole=async(req,res,next)=>{
  const role=req.query.role
  const organization_code=req.userinfo.organization_code;
  const user=await User.find({userRole:role,organizationCode:organization_code})
  return res.json(user)
}
exports.getUserById=async(req,res,next)=>{
  const id=req.query.id
  const organization_code=req.userinfo.organization_code;
  const user=await User.find({_id:id,organizationCode:organization_code})
  return res.json(user)
}
exports.getAssignedUserByRole=async(req,res,next)=>{
  const role=req.query.role
  const organization_code=req.userinfo.organization_code;
  const user=await User.find({userRole:role,organizationCode:organization_code,isAssigned:process.env.ASSIGNEDUSER})
  return res.json(user)
}
exports.getUserByRoleWithEdit=async(req,res,next)=>{
  const role=req.query.role
  const current_user=req.query.current
  const organization_code=req.userinfo.organization_code;
  const user=await User.find({$or:[{_id:current_user},{userRole:role,organizationCode:organization_code,isAssigned:process.env.UNASSIGNEDUSER}]})
  return res.json(user)
}
exports.activateOrganizationUser = async (req, res, next) => {
  try {
      const updateduserid=req.params.id
      const organization_code=req.userinfo.organization_code;
      const id=req.userinfo._id;
      const user_role=req.userinfo.user_role;
      const superadminuser=await User.findOne({userRole:process.env.SUPERADMIN,organizationCode:organization_code})
  if(user_role===process.env.SUPERADMIN || user_role===process.env.ADMIN)
  { 
  if(updateduserid==superadminuser._id){ 
    const error = new Error("you can't change status of superadmin user.")
    error.statusCode = 400
    throw error;
  }
    await User.findByIdAndUpdate(id,{
      isActive:true,
      isAssigned:false,
    })
    return res.json("user removed successfully")
  }
  const error = new Error("you don't have privilage to chage user status.")
  error.statusCode = 400
  throw error;
    
    }
    catch(error) {
      next(error)
       }
  };

//change password
exports.changePassword = async (req, res, next) => {
  try {
    const password=req.body.newPassword
    const oldPasswrod=req.body.oldPassword
    let passwordHash
    const id=req.userinfo.sub;
    const user = await User.findById(id);
    const isMatch = await bcrypt.compare(oldPasswrod, user.password)
    if (!isMatch) {
      const error = new Error("Incorrect old password.")
      error.statusCode = 400
      throw error;
    }
  if(password)
{
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    passwordHash = await bcrypt.hash(password, salt);
  } 

   await User.findByIdAndUpdate(id,{password:passwordHash})
    return res.json({success:true})
  }
  catch(err){
    next(err)
  }
}
//temp reset Password
exports.tempResetPassword = async (req, res, next) => {
  try {
    const sub=req.params.id
    const password=req.body.password
    let passwordHash
    const role=req.userinfo.user_role;
  if(password)
{
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    passwordHash = await bcrypt.hash(password, salt);
  } 
  if(role==process.env.SUPERADMIN)  
{
  await User.findByIdAndUpdate(sub,{password:passwordHash})
  return res.json({success:true})
}  
if(role==process.env.ADMIN)
{
  await User.findOneAndUpdate({_id:sub,userRole:{ $nin:[process.env.SUPERADMIN,process.env.OWNER,process.env.ADMIN]}},{password:passwordHash})
  return res.json({success:true})
}

  }
  catch(err){
    next(err)
  }
}
