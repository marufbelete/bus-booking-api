const jwt = require("jsonwebtoken");
const authenticateJWT = (req, res, next) => {
  const token =req.cookies.access_token;
  console.log(token)
  if (token) {
    jwt.verify(token,process.env.SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({msg:"you don't have permission please login first",status:false });
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


