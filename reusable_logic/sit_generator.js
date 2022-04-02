
export const between=(min, max)=> {  
  let random= Math.floor(Math.random() * (max - min + 1) + min)
  while(occupied2.includes(random)){
    random= Math.floor(Math.random() * (max - min + 1) + min)
    continue
  }
    return random
}

export const milliSecond=(hours)=>{
   return hours * 60 * 60 *1000;
}



