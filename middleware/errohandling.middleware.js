
exports.errorHandler = (err,req,res,next) =>{
!!err.statusCode? err.statusCode : err.statusCode=500;
!!err.code? err.message : err.message="unknow server error";
    return res.status(err.statusCode).json({message:err.message,status:false});
}
