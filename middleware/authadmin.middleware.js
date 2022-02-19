const Role=require("../accesscontoller.json")

exports.authOwner = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===Role.OWNER) {
    next()
    }
  res.status(403).json({message:"you do not have privillage",status:false})

};

exports.authSuperAdmin = (req, res, next) => {
  console.log(req.userinfo)
  const userrole=req.userinfo.user_role;
  if (userrole===Role.SUPERADMIN) {
    next()
      }
  res.status(403).json({message:"you do not have privillage",status:false})

};

exports.authAdmin = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===Role.ADMIN || userrole===Role.SUPERADMIN) {
    next()
      }
  res.status(403).json({message:"you do not have privillage",status:false})

};

exports.authaAdminCasher = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===Role.ADMIN || userrole===Role.SUPERADMIN||userrole===Role.CASHER) {
    next()
      }
  res.status(403).json({message:"you do not have privillage to access this page",status:false})
};

exports.authaAdminCasherAgent = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===Role.ADMIN  || userrole===Role.SUPERADMIN||userrole===Role.CASHER||userrole===Role.AGENT) {
    next()
      }
  res.status(403).json({message:"you do not have privillage to access this page",status:false})
};



