const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const token =req.cookies.access_token;
  if (token) {
    jwt.verify(token,process.env.SECRET, (err, user) => {
      if (err) {
    const error= new Error("permission denied")
    error.code = 400
    throw error;
    }
      req.userinfo = user;
      next();
      return;
    });
  }
  else {
    return res.status(403).json({message:"no token"});
  }
};
module.exports = authenticateJWT;


