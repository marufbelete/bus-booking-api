const jwt = require("jsonwebtoken");

const config = process.env;

const authenticateOrganizationUser = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole==='admin' || userrole==='firstadmin') {
    next()
      }
  res.json("you do not have privillage to access this page")

};

module.exports = authenticateJWT;


