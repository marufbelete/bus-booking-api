
exports.authOwner = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===process.env.OWNER) {
    next()
    return;
    }
  return res.status(403).json({message:"you do not have privillage",status:false})

};

exports.authSuperAdmin = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===process.env.SUPERADMIN) {
    next()
    return;
      }
  return res.status(403).json({message:"you do not have privillage",status:false})

};
exports.authAdmin = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===process.env.ADMIN || userrole===process.env.SUPERADMIN) {
    next()
    return;
      }
  return res.status(403).json({message:"you do not have privillage",status:false})

};

exports.authaAdminCasher = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===process.env.ADMIN || userrole===process.env.SUPERADMIN||userrole===process.env.CASHER) {
    next()
    return;
      }
  return res.status(403).json({message:"you do not have privillage to access this page",status:false})
};

exports.authaAdminCasherAgent = (req, res, next) => {
  const userrole=req.userinfo.user_role;
  if (userrole===process.env.ADMIN  || userrole===process.env.SUPERADMIN||userrole===process.env.CASHER||userrole===process.env.SUPERAGENT) {
    next()
    return;
      }
  return res.status(403).json({message:"you do not have privillage to access this page",status:false})
};



