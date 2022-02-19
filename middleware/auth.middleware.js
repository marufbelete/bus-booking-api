const jwt = require("jsonwebtoken");
const config = require('../config.json');

const authenticateJWT = (req, res, next) => {
  console.log(req.headers)
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // const token = authHeader
    jwt.verify(token,config.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({msg:"you don't have permission please login first",status:false });
      }
      req.userinfo = user;
      console.log(user)
      next();
      return;
    });
  }
  else {
    res.status(401).json({ message: "you don't have authentication permission",status:false });
  }
};
module.exports = authenticateJWT;


