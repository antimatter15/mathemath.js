var radix = 10;
var arrays = [];

Array.prototype.valueOf = function(){
  return Math.pow(radix, arrays.push(this) - 1);
}

Object.defineProperty(Number.prototype, "m", {
  get: function(){
    var v = this.valueOf();
    //determine what combination of operators resulted in this
    // find highest index Math.round(Math.log(Math.abs(-1109))/Math.log(10))
    
    for(var i = 0; i < arrays.length; i++){
      console.log(v, Math.pow(radix, i));
    }
  }
});

console.log(([1,2,3,4] - [1,2,3,4] - [1,2,3,4] - [1,2,3,4]).m)
