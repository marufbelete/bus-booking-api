const autocannon=require('autocannon')
require('dotenv').config({path:'../.env'})
const {userInfoObject} =require('./get_users')
function startBench(){
const users=userInfoObject()
let request_number=0
console.log(users[0])
//this hlep us to know iterate over each data for every reuest
    const url=process.env.BASE_URL
    console.log(url)
    const args=process.argv?.slice(2)
    const connections=args[0]||100
    const maxConnectionRequests=args[1]||1
    const instance=autocannon({
        url,
        connections,
        maxConnectionRequests,
        duration:10,
        headers:{
            "content-type": "application/json",        },
        requests:[{
            method:"POST",
            path:"/registermobileuser",
            setupRequest:function(request){
                request.body=JSON.stringify(users[request_number])
                request_number++
                return request
            }
        }]
    },doneBenchmark)
    autocannon.track(instance)
    function doneBenchmark(err,res){
        console.log("Benchmark Done",err,res)
    }
}
startBench()