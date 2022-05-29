const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log(req.headers)
  console.log('token')
  const authHeader = req.headers.authorization.split(' ')[1];
  if (authHeader) {
    const token = authHeader;
    // const token = authHeader
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
    res.status(401).json({ message: "you don't have authentication permission",status:false });
  }
};
module.exports = authenticateJWT;


