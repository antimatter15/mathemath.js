var radix = 10;
var str_cache = {};
var num_cache = [];

function wrap(fn){
  var tokens = {};
	fn.toString().match(/[$A-Z_][0-9A-Z_$]*/gi).forEach(function(token){tokens[token] = 1});
	tokens = Object.keys(tokens);
	function lengths(arr){return arr.map(function(e){return e.length})}
	function same(arr){var first = arr[0]; for(var i = 1; i < arr.length; i++){ if(arr[i] != first) return false; }; return true}
	function negate(arr){return arr.map(function(e){return -e})}
	function transpose(a) {return Object.keys(a[0]).map(function(c) {return a.map(function(r) {return r[c]})})}
	function sum(arr){return arr.reduce(function(a, b){return a + b})}

	function fixnum(value){
		var i = Math.round(Math.log(Math.abs(value))/Math.log(radix)) + 1; // find highest index 
		var v = value.valueOf() + Math.pow(radix, i + 1);
		var sumlist = [], sublist = [], unused = [];
		//determine what combination of operators resulted in this
		while(i--){
			var digit = Math.round((v / Math.pow(radix, i)) % radix);
			if(digit == 1) sumlist.push(num_cache[i]);
			else if(digit == radix - 1) sublist.push(num_cache[i]);
			else if(digit == 0) unused.push(num_cache[i]);
			else return null;
		}
		var all = sumlist.concat(sublist.map(negate));
		if(!same(lengths(all))) throw "different array sizes";
		return transpose(all).map(sum)
	}
	function fix(value){
			
		if((typeof value == 'number' || value instanceof Number)){
			var fixed = fixnum(value);
			if(fixed) value = fixed;
		}
		if((typeof value == "string" || value instanceof String) && value[0] == "@"){
			return document.querySelectorAll(value.slice(1))
		}
		if(value in str_cache){
			return str_cache[value]
		}else{
			return value
		}
	}
	function fake(scope){
		var fake_scope = {};
		tokens.forEach(function(token){
			Object.defineProperty(fake_scope, token, {
				get: function(){
					if(typeof scope[token] == 'object'){
					// console.log('get (recursive)', token, scope[token])
						return fake(scope[token]);
					}else if(typeof scope[token] == 'function'){
						// console.log('function', token, scope[token])
						return function(){
							// console.log('fn called', token, arguments)
							var arrg = [].slice.call(arguments, 0).map(fix);
							scope[token].apply(scope, arrg);
						}
					}else{
						// console.log('get', token, scope[token])
						return fix(val);
					}	
					
				},
				set: function(val){
					scope[token] = val
					// console.log('set', token, scope[token])
				}
			})
		})
		return fake_scope
	}

	function get(obj, attr){
		// console.log('get', attr, obj)
		if(obj.__attr){
			return obj.__attr[attr];
		}else{
			return obj[attr];
		}
	}

	function proto(primitive){
		if(!("__attr" in primitive)){
			primitive.__attr = {};	
		}
		

		tokens.forEach(function(token){
			if(!(token in primitive.__attr))
				primitive.__attr[token] = primitive[token];
			
			Object.defineProperty(primitive, token, {
				get: function(){
					return get(fix(this), token)
				}
			})		
		})
	}
	proto(Number.prototype)
	proto(String.prototype)
	fn(fake(window));
}

Object.keys(document.createElement('input')).forEach(function(key){
	if(NodeList.prototype[key]) return;
	Object.defineProperty(NodeList.prototype, key, {
		get: function(){
			return [].slice.call(this, 0).map(function(e){
				return e[key]
			})
		},
		set: function(val){
			[].slice.call(this, 0).forEach(function(e){
				e[key] = val;
			})
		}
	})
})

Object.defineProperty(Array.prototype, 'l', {
	get: function(){
		var n = {};
		var id = Math.random().toString(36).slice(4);
		for(var i = 0; i < this.length; i++)
			str_cache[id+i] = n[id+i] = this[i];
		return n;	
	}
});

Array.prototype.valueOf = function(){
  return Math.pow(radix, num_cache.push(this) - 1);
}


wrap(function(e){with(e){
	// console.log([1, 2, 3, 4] + [5, 6, 7, 8] - [1, 2, 3, 4])
	// var blah = "hello world";
	console.log("@div".innerHTML)
	// alert("hi");
	// for(i in [1,2,3,4].l){
	// 	console.log('blarp', i);
	// }
}})
