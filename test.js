var radix = 3;
var arrays = [];

negate = function(x){ return -x }

Array.prototype.valueOf = function(){
  return Math.pow(radix, arrays.push(this) - 1);
}

Array.prototype.attrs = function(attr){
  return this.map(function(e){
    return e[attr]
  })
}

Array.prototype.lengths = function(){
  return this.attrs('length')
}

Array.prototype.same = function(){
  if(this.length == 0) return true;
  var first = this[0];
  for(var i = 1; i < this.length; i++)
    if(this[i] != first) return false;
  return true;
}

Object.defineProperty(Number.prototype, "m", {
  get: function(){
    return function(){
      
    }
  }
})

Object.defineProperty(Number.prototype, "m", {
  get: function(){
    if(radix <= 2) throw "minimum radix is 3";

    var i = Math.round(Math.log(Math.abs(this))/Math.log(radix)) + 1
    var v = this.valueOf() + Math.pow(radix, i + 1);
    console.log(v, i);
    //determine what combination of operators resulted in this
    // find highest index 
    var sumlist = [], sublist = [], unused = [];
    for(; i--; ){
      var digit = Math.round((v / Math.pow(radix, i)) % radix);
      if(digit == 1) sumlist.push(arrays[i]);
      else if(digit == radix - 1) sublist.push(arrays[i]);
      else if(digit == 0) unused.push(arrays[i]);
      else throw "could not parse number";
    }
    if(!sumlist.lengths().same() || !sublist.lengths().same())
      throw "different array sizes";
    
    negate.m(sublist)

    console.log(sumlist, sublist, unused)

  }
});

console.log(([1,2,3,4] - [1,2,3,4] - [1,2,3,4] - [1,2,3,4]).m)
