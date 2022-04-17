const express = require("express");
require('dotenv').config({path:".env"});
const mongoose = require("mongoose")
const app = express();
const cookieParser=require('cookie-parser')
const cors=require("cors")
const userroute = require('./routes/user.route');
const manageroute = require('./routes/manage.route');
const dashboard = require('./routes/dashboard.route');
const transfer = require('./routes/scheduletransfer.route');

// const socketio=require("./socket/socketio")
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(""))
//routes
app.use(userroute)
app.use(manageroute)
app.use(dashboard)
app.use(transfer)
console.log(process.env.PORT)
mongoose.connect("mongodb+srv://maruf:maruf@cluster0.zrkgb.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {
  useNewUrlParser: true,useUnifiedTopology: true,useCreateIndex:true
})
mongoose.connection.on("error", err => {
  console.log("err please try again")
})
mongoose.connection.on("connected", (err, res) => {
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`)
  })
//   const io=socketio.init(httpServer)
//   io.on("connection",(socket)=>{
// console.log("socket connection created")
//   })
})



