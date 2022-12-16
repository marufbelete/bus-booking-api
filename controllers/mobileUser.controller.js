const User = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

//signup for mobile user
exports.saveMobileUser = async (req, res, next) => {
  try {
    const phone_number = req.body.phoneNumber;
    const password=req.body.password;
    const confirmpassword=req.body.confirmPassword;
    const {firstName,lastName,userRole}=req.body
    if (!phone_number || !password||!confirmpassword||
       !firstName||!lastName) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
    }
    const anyphone_number = await User.findOne({
      phoneNumber: phone_number,
    });
    if (anyphone_number) {
      const error = new Error("User with this phone number already exist!!!")
      error.statusCode = 400
      throw error;
    }
    if (password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    if (password != confirmpassword) {
      const error = new Error("password doesn't match. please try again." )
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    const newuser = new User({
      phoneNumber: phone_number,
      password: passwordHash,
      firstName,
      lastName,
      isMobileUser:true,    
    })
    const user=await newuser.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number }, process.env.SECRET);
    return res.cookie('token',token,{secure:true,
      httpOnly:true,SameSite:'strict'}).
      json({auth:true,token:token,role:user.userRole,
        firstName:user.firstName,lastName:user.lastName})
  }
catch(error) {
 next(error)
  }
};

//log in mobile user
exports.loginMobileUser = async (req, res, next) => {
  try {
    const {phoneNumber,password}  = req.body;
    if (!phoneNumber || !password) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
    }
    const user = await User.findOne({
      phoneNumber: phoneNumber,
      isMobileUser:true
    });
    if (!user) {
      const error = new Error("No account with this Phone exist.")
      error.statusCode = 400
      throw error;
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      const error = new Error("Invalid credential.")
      error.statusCode = 400
      throw error;
    }
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number},process.env.SECRET);
    return res.cookie('token',token,{secure:true,httpOnly:true,SameSite:'strict'})
    .json({auth:true,token:token,role:user.userRole,
      firstName:user.firstName,lastName:user.lastName})
  }
  catch(error) {
    next(error)
     }
};
//update mobile user info
exports.updateMobileUser = async (req, res, next) => {
  try {
    const {firstName,lastName,password} = req.body;
    const change={}
    if (password&&password.length < 5) {
      const error = new Error("the password need to be atleast 5 charcter long.")
      error.statusCode = 400
      throw error;
    }
    else{
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      change.password=passwordHash
    }
    if(firstName){ change.firstName=firstName}
    if(lastName){change.lastName=lastName}
   await User.findOneAndUpdate({_id:req.user.sub},{
  $set:{
 ...change
}
  })
  return res.json({message:"success",status:true})
  }
  catch(error) {
   next(error)
  }
};


