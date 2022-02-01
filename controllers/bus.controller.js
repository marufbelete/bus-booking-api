const Bus = require("../models/bus.model");

exports.registerBus = async (req, res, next) => {
  try {
    const busplateno = req.body.organizationname;
    const bussideno= req.body.organizationcode;
    const driverusername =req.body.driversuername;
    const totalsit =req.body.totalsit;
    const createdby =req.user.sub;
    const orgcode =req.user.organization_code;
if(!!busplateno && !!bussideno && !!driverusername && !!totalsit)
{ 
    const newbus= new Bus({
      busPlateNo:busplateno ,
      busSideNo:bussideno,
      driverUserName:driverusername,
      totalNoOfSit:totalsit,
      createdBy:createdby,
      organizationCode:orgcode,
    })
    const savedbus=await newbus.save()
    return res.json(savedbus)
  }
  const error = new Error("please fill all field")
  error.statusCode = 400
  throw error;
  }
catch(error) {
next(error);
  }
};
//get all organizaton bus organization
exports.getAllOrganizationBus = async (req, res, next) => {
  try {
  const orgcode =req.user.organization_code;
  const allbus= await Bus.find({organizationCode:orgcode})
  res.json(allbus)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id
exports.updateBusInfo = async (req, res, next) => {
  try {
   const id=req.params.id
   const busplateno = req.body.organizationname;
   const bussideno= req.body.organizationcode;
   const driverusername =req.body.driversuername;
   const totalsit =req.body.totalsit;
   const bus= await Bus.findAndUpdateById(id,{
     $set:{
      busPlateNo:busplateno ,
      busSideNo:bussideno,
      driverUserName:driverusername,
      totalNoOfSit:totalsit,
     }
   })
   res.json(bus)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteBus = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await Bus.findByIdAndDelete(deleteid)
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};
