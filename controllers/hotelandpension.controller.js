const HotelAndPension = require("../models/hotelandpension.model");

exports.registerHotelsAndPensions = async (req, res, next) => {
  try {
    const cityname = req.body.cityname;
    const hotelname =req.body.hotelrname;
    const hoteldescription =req.body.hoteldescription;
    const hotelcontact =req.body.hotelcontact;
    const hotelmaplocation=req.body.hotelmaplocation
    const pensionname =req.body.pensionname;
    const pensiondescription =req.body.pensiondescription;
    const pensioncontact =req.body.pensioncontact;
    const pensionmaplocation=req.body.pensionmaplocation

    const newbus= new HotelAndPension({
      cityName:cityname,
      hotelName:hotelname,
      hotelDescription:hoteldescription,
      hotelContact:hotelcontact,
      hotelMapLocation:hotelmaplocation,
      pensionName:pensionname,
      pensionDescription:pensiondescription,
      pensionContact:pensioncontact,
      pensionMapLocation:pensionmaplocation,
    })
    const savedbus=await newbus.save()
    return res.json(savedbus)
  }
catch(error) {
next(error);
  }
};

exports.getGetAllHotelAndPension = async (req, res, next) => {
  try {
  const all_hotel_and_pension= await HotelAndPension.find()
  return res.json(all_hotel_and_pension)
  }
  catch(error) {
    next(error)
  }
};

exports.getGetAllHotelAndPensionByCity = async (req, res, next) => {
  try {
  const city_name=req.params.cityname
  const all_hotel_and_pension_in_city= await HotelAndPension.find({cityName:city_name})
  return res.json(all_hotel_and_pension_in_city)
  }
  catch(error) {
    next(error)
  }
};
//get organization by id
exports.updateHotelAndPensionInfo = async (req, res, next) => {
  try {
    const cityname = req.body.cityname;
    const hotelname =req.body.hotelrname;
    const hoteldescription =req.body.hoteldescription;
    const hotelcontact =req.body.hotelcontact;
    const hotelmaplocation=req.body.hotelmaplocation
    const pensionname =req.body.pensionname;
    const pensiondescription =req.body.pensiondescription;
    const pensioncontact =req.body.pensioncontact;
    const pensionmaplocation=req.body.pensionmaplocation
    const hotelandpension= await HotelAndPension.findAndUpdateById(id,{
     $set:{
      cityName:cityname,
      hotelName:hotelname,
      hotelDescription:hoteldescription,
      hotelContact:hotelcontact,
      hotelMapLocation:hotelmaplocation,
      pensionName:pensionname,
      pensionDescription:pensiondescription,
      pensionContact:pensioncontact,
      pensionMapLocation:pensionmaplocation,
     }
   })
   return res.json(hotelandpension)
  }
  catch(error) {
    next(error)
  }
};
//delete role
exports.deleteHotelAndPension = async (req, res, next) => {
  try {
   const deleteid=req.params.id
   await HotelAndPension.findByIdAndDelete(deleteid)
   res.json("deleted successfully")
  }
  catch(error) {
    next(error)
  }
};
