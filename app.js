const express = require("express");
const mongoose = require("mongoose")
const app = express();
const userroute = require('./routes/user.route');
const manageroute = require('./routes/manage.route');
const config =require('./config.json')
const socketio=require("./socketio")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// user route
app.use(userroute)
//post related route
app.use(manageroute)

mongoose.connect("mongodb://localhost:27017/mela", {
  useNewUrlParser: true
})
mongoose.connection.on("error", err => {
  console.log("err please try again")
})
mongoose.connection.on("connected", (err, res) => {
  const PORT = process.env.PORT||config.PORT
  app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`)
  })
  const io=socketio.init(httpServer)
  io.on("connection",(socket)=>{
console.log("socket connection created")
  })
})



