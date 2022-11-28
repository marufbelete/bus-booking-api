//check if unique true
function checkIfArrayIsUnique(myArray) {
    return myArray.length === new Set(myArray).size;
  }
module.exports.checkIfArrayIsUnique=checkIfArrayIsUnique