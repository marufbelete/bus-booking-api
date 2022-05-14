const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  console.log(req)
  console.log('token')
  const authHeader = req.headers;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    console.log(authHeader.split(' ')[1])
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


