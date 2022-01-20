const express = require("express");
const mongoose = require("mongoose")
const app = express();
const userroute = require('./routes/user.route');
const postroute = require('./routes/post.route');
const accessTokenSecret = 'youraccesstokensecret';

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

// user route
app.use(userroute)
//post related route
app.use(postroute)

mongoose.connect("mongodb://localhost:27017/mela", {
  useNewUrlParser: true
})


mongoose.connection.on("error", err => {
  console.log("err please try again")
})

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected")

  const PORT = 3000
  app.listen(PORT, () => {
    console.log(`app is listening to PORT ${PORT}`)
  })

})



