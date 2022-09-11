const fs=require('fs')
const random=require('short-unique-id')
const {userInfoObject} =require('./get_users')
function generateUser(){
    const test_user=userInfoObject()
    const phonens=test_user.map(e=>e.phoneNumber)
    for(let i=0;i<1;i++){
        const test_phone=generateNumber()
       const test_password=new random({length:8})()
       while(phonens.includes(test_phone))
       {
        test_phone=generateNumber()
       }
        phonens.push(test_phone)
        test_user.push({
            phoneNumber:test_phone,
            password:test_password,
            confirmPassword:test_password
        })
    }
    fs.writeFileSync('user_info.json',JSON.stringify(test_user))
    return
}
function generateNumber(){
    const number=Math.floor(Math.random() * 10000000000)
    return number
}
generateUser()
