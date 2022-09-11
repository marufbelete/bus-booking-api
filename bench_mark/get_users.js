const fs=require('fs')
function userInfoObject(){
    const user_log=fs.readFileSync('user_info.json')
    const result=JSON.parse(user_log)
    return result
}
module.exports={userInfoObject}