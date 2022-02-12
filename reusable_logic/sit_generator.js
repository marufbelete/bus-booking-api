
function between(min, max) {  
  let random= Math.floor(Math.random() * (max - min + 1) + min)
  while(occupied2.includes(random)){
    random= Math.floor(Math.random() * (max - min + 1) + min)
    continue
  }
    return random
}

// function callname(name){

// }
exports.between = between


