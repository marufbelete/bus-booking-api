const User = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken');
const config = require('../config.json');

//signup for mobile user
exports.saveMobileUser = async (req, res, next) => {
  try {
    const phone_number = req.body.phonenumber;
    const password=req.body.password;
    const confirmpassword=req.body.confirmpassword;
    if (!!!phone_number || !!!password) {
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
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number }, config.SECRET);
    res.json({
      token
    });
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
    if (!!!phone_number || !!!password) {
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
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number},config.SECRET);
    res.json({
      token
    });
  }
  catch(error) {
    next(error)
     }
};
//update mobile user info
exports.updateMobileUser = async (req, res, next) => {
  try {
    const name = req.body.name;
    const phone_number = req.body.phoneNumber;
    const password=req.body.password;
    const confirm_password=req.body.confirmPassword;
    if (!!!phone_number || !!!password) {
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
      const error = new Error("password doesn't match. please try again.")
      error.statusCode = 400
      throw error;
    }
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
  const updateduser=await User.findOneAndUpdate({phoneNumber:phone_number},{
  $set:{
  name:name,
  password:passwordHash,
}
  })
  res.json(updateduser)
  }
  catch(error) {
   next(error)
  }
};

