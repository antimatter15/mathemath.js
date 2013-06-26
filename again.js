function wrap(fn){
	function fake(scope){
		var fake_scope = {};
		fn.toString().match(/[$A-Z_][0-9A-Z_$]*/gi).forEach(function(token){
			if(token in fake_scope) return;
			Object.defineProperty(fake_scope, token, {
				get: function(){
					if(typeof scope[token] == 'object'){
					console.log('get (recursive)', token, scope[token])
						return fake(scope[token]);
					}else if(typeof scope[token] == 'function'){
						console.log('function', token, scope[token])
						return function(){
							// scope[token].apply(this, arguments)
							console.log('woop')
						}
					}else{
						console.log('get', token, scope[token])
						return scope[token]
					}
				},
				set: function(val){
					scope[token] = val
					console.log('set', token, scope[token])
				}
			})		
		})
		return fake_scope
	}
	fn(fake(window));
}

wrap(function(e){with(e){
	var blah = "hello world";
	alert("hi")
}})