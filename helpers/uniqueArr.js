//change to unique arr with fiter.onlyUnique()
function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
//check if it's unique
function checkIfArrayIsUnique(myArray) {
  return myArray.length === new Set(myArray).size;
}
  module.exports.onlyUnique=onlyUnique

