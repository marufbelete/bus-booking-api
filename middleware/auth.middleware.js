const jwt = require("jsonwebtoken");

const config = process.env;

const authenticateJWT = (req, res, next) => {
  console.log(req.headers)
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    // const token = authHeader
    jwt.verify(token, "marufsecret", (err, user) => {
      if (err) {
        return res.status(403).send({ msg: "something wrong" });
      }

      req.user = user;
      console.log(user)
      next();
    });
  }
  else {
    res.status(401).send({ message: "no token exist" });
  }

};

module.exports = authenticateJWT;


