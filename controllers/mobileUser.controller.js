const User = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');

//signup for mobile user
exports.saveMobileUser = async (req, res, next) => {
  try {
    const phone_number = req.body.phoneNumber;
    const password=req.body.password;
    const confirmpassword=req.body.confirmPassword;
    if (!phone_number || !password) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
    }
    const anyphone_number = await User.find({
      phone_number: phone_number,
      user_type: user_type,
    });
    if (anyphone_number.length>0) {
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
      phone_number: phone_number,
      password: passwordHash,
      isMobileUser:true,    
    })
    const user=await newuser.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number }, process.env.SECRET);
    res.cookie('token',token,{secure:true,httpOnly:true,SameSite:'strict'})
    return res.json({auth:true})
  }
catch(error) {
 next(error)
  }
};

//log in mobile user
exports.loginMobileUser = async (req, res, next) => {
  try {
    const phone_number  = req.body.phonenumber;
    const password=req.body.password
    if (!phone_number || !password) {
      const error = new Error("Please fill all field.")
      error.statusCode = 400
      throw error;
    }
    const user = await User.find({
      phone_number: phone_number
    });
    if (user.length===0) {
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
    res.cookie('token',token,{secure:true,httpOnly:true,SameSite:'strict'})
    return res.json({auth:true})
  }
  catch(error) {
    next(error)
     }
};
//update mobile user info
exports.updateMobileUser = async (req, res, next) => {
  try {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const password=req.body.password;
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
    if(firstName)
    {
      change.firstName=firstName
    }
    if(lastName)
    {
      change.lastName=lastName
    }
  const updateduser=await User.findOneAndUpdate({_id:req.user.sub},{
  $set:{
 ...change
}
  })
  return res.json(updateduser)
  }
  catch(error) {
   next(error)
  }
};

