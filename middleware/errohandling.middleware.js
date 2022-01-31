
exports.errorHandler = (err,req,res,next) =>{

!!err.statusCode? err.statusCode : err.statusCode=500;
    return res.status(err.statusCode).json({message:err.message,status:false});
}