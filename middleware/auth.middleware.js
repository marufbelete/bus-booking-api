const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log(req.headers)
  console.log('token')
  const authHeader =req.cookies.access_token;
  if (authHeader) {
    jwt.verify(token,process.env.SECRET, (err, user) => {
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
    return res.status(403).json({message:"no token"});
  }
};
module.exports = authenticateJWT;


