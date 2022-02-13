const express = require("express");
const mongoose = require("mongoose")
const app = express();
const userroute = require('./routes/user.route');
const manageroute = require('./routes/manage.route');
const dashboard = require('./routes/dashboard.route');
const transfer = require('./routes/scheduletransfer.route');
const config =require('./config.json')
// const socketio=require("./socket/socketio")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//routes
app.use(userroute)
app.use(manageroute)
app.use(dashboard)
app.use(transfer)

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
//   const io=socketio.init(httpServer)
//   io.on("connection",(socket)=>{
// console.log("socket connection created")
//   })
})



