let io;
module.exports={
init:(server)=>{
require("socketio")(server)
},
getIo:()=>{
  if(!io)
  {
    throw new Error("can't initialize socket")
  }
  else{return io}
}
}


