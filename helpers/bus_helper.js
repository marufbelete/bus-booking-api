const Bus = require("../models/bus.model");
const isBusPlateNumberUnique=async(plateNo)=>{
    const bus=await Bus.findOne({busPlateNo:plateNo})
    if(bus){return false}
    return true
}
const isBusSideNumberUnique=async(sideNo)=>{
    const bus=await Bus.findOne({busSideNo:sideNo})
    if(bus){return false}
    return true
}

module.exports={
    isBusPlateNumberUnique,
    isBusSideNumberUnique
}