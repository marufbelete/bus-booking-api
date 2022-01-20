const User = require("../models/user.model");
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');

//signup
exports.saveUser = async (req, res, next) => {

  try {

    const { username, password, confirmpassword } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all field." })
    }

    if (password.length < 5) {
      return res.status(400).json({ error: true, message: "the password need to be atleast 5 charcter long." })
    }

    if (password != confirmpassword) {

      return res.status(400).json({ error: true, message: "password doesn't match. please try again." })
    }


    const anyusername = await User.findOne({
      username: username,
    });

    if (anyusername) {
      return res.status(400).json({
        error: true,
        message: "user-name is already in use",
      });
    }


    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      username: username,
      password: passwordHash,
    })

    await user.save()
    const token = jwt.sign({ sub: user._id, username: user.username }, "marufsecret");
    res.json({
      token
    });

  }

  catch {
    res.status(500).json({ err: error.message })
  }
};

//log in
exports.loginUser = async (req, res, next) => {

  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ message: "Please fill all field." })
    }

    const user = await User.findOne({
      username: username,
    });
    
    console.log(User.db.model); // localhost
    console.log(User.db.host); // 27017
    console.log(User.db.collections); // myDatabase
    console.log(user)
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "No account with this user-name exist",
      });
    }


    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credential." });
    }

    const token = jwt.sign({ sub: user._id, username: user.username }, "marufsecret");
    res.json({
      token
    });

  }

  catch {
    res.status(500).json({ err: error.message })
  }
};
//update user info
