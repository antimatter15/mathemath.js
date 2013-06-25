var radix = 10;
var arrays = [];

Array.prototype.valueOf = function(){
  return Math.pow(radix, arrays.push(this) - 1);
}

Object.defineProperty(Number.prototype, "m", {
  get: function(){
    var v = this.valueOf();
    //determine what combination of operators resulted in this
    // find highest index 
    var sumlist = [], sublist = [], unused = [];
    for(var i = Math.round(Math.log(Math.abs(v))/Math.log(radix)) + 1; i--; ){
      var digit = Math.round((v / Math.pow(radix, i)) % radix);
      if(digit == -9 || digit == 1) sumlist.push(arrays[i]);
      else if(digit == 9 || digit == -1) sublist.push(arrays[i]);
      else if(digit == 0) unused.push(arrays[i]);
      else throw "could not parse number";
    }
    console.log(sumlist, sublist, unused)
  }
});

console.log(([1,2,3,4] - [1,2,3,4] - [1,2,3,4] - [1,2,3,4]).m)
