const express = require("express");
const mongoose = require("mongoose")
const app = express();
const cookieParser=require('cookie-parser')
const cors=require("cors")
const userroute = require('./routes/user.route');
const manageroute = require('./routes/manage.route');
const dashboard = require('./routes/dashboard.route');
const transfer = require('./routes/scheduletransfer.route');
const {ApolloServer}=require('apollo-server-express')
const resolvers =require('./gqlShema/resolver')
const typeDefs =require('./gqlShema/typedefs')
const jwt = require("jsonwebtoken");
// const responseTime=require('response-time')
require('dotenv').config()

// const socketio=require("./socket/socketio")
app.use(cors({ origin:['http://localhost:3000','https://studio.apollographql.com'], credentials: true }))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
//log response time
// app.use(responseTime((req, res, time) => {
//   console.log(`${req.method} ${req.url} ${time}ms`);
// }))
//routes
app.use(userroute)
app.use(manageroute)
app.use(dashboard)
app.use(transfer)
const StartServer=async()=>{
  const apolloServer=new ApolloServer({
  typeDefs, 
  resolvers,
  cache: 'bounded',
  csrfPrevention: true,
  context:async({ req, res }) => {
    console.log(req.cookies)
    const token = req.cookies.access_token;
    console.log(token)
    let users
    if (!token) {
      return {value:"no token"}
    }
    try {
      jwt.verify(token, process.env.SECRET, (err, user) => {
        if (err) {
          return {value:"token error"}
        }
        users=user
        return;
      });
    } 
    catch {
      return {value:"unkown error"};
    }
    return users
  },
})
await apolloServer.start()
apolloServer.applyMiddleware({app:app,cors:{origin: ['http://localhost:3000','https://studio.apollographql.com'],
credentials: true}})
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
})
}
StartServer()



