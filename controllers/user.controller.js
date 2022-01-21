const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//signup for mobile user
exports.saveMobileUser = async (req, res, next) => {

  try {

    const phone_number = req.body.phonenumber;
    const password=req.body.password;
    const confirmpassword=req.body.confirmpassword;
    
    if (!!!phone_number || !!!password) {
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

    if (password != confirmpassword) {

      return res.status(400).json({ error: true, message: "password doesn't match. please try again." })
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      phone_number: phone_number,
      password: passwordHash,
      isMobileUser:true,
      
    })

    await user.save()
    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number }, "marufsecret");
    res.json({
      token
    });

  }

  catch {
    res.status(500).json({ err: error.message })
  }
};
//register organization user
exports.saveorganizationUser = async (req, res, next) => {
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

//log in mobile user
exports.loginUser = async (req, res, next) => {

  try {
    const phone_number  = req.body.phonenumber;
    const password=req.body.password
    if (!!!phone_number || !!!password) {
      return res.status(400).json({ message: "Please fill all field." })
    }

    const user = await User.find({
      phone_number: phone_number
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

    const token = jwt.sign({ sub: user._id, phone_number: user.phone_number}, "marufsecret");
    res.json({
      token
    });

  }

  catch {
    res.status(500).json({ err: error.message })
  }
};
//log in organization user
exports.loginUser = async (req, res, next) => {

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
//update user info
