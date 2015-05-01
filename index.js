/*

https://github.com/oliver-moran/toSource.js

force override to get our behaviour

*/

Object.toSource = function(object){
	if( object === null ) return 'null';
	if( object === undefined ) return 'undefined';
	if( typeof object.toSource === 'function' ){
		var source = object.toSource();
		if( typeof source != 'string' ) throw new TypeError('custom toSource() method must return string');
		return source;
	}
	return String(object);
};

Object.sourceOf = function(value, seen, circular){
	var source;

	if( seen && value !== null && typeof value === 'object'){
		if( seen.indexOf(value) > -1 ){
			source = circular;
		}
		else{
			seen.push(value);
			source = value.toSource(seen);
		}
	}
	else{
		source = Object.toSource(value);
	}

	return source;
};

Number.prototype.toSource = function(){
	return this.toString();
};

Boolean.prototype.toSource = function(){
	return this.toString();
};

RegExp.prototype.toSource = function(){
	return this.toString();
};

Date.prototype.toSource = function(){
	return '(new Date(' + this.valueOf() + '))';
};

String.prototype.toSource = function(){
	var source = this.replace(/"/g, '\\"');
	source = source.replace(/\n/g, '\\n');
	source = source.replace(/\r/g, '\\r');
	return '"' + source + '"';
};

Function.prototype.toSource = function(){
	return '(' + this.toString() + ')';
};

Error.prototype.toSource = function(){
	return '(new ' + this.name + '('+ this.message.toSource() +'))';
};

Object.prototype.toSource = function(seen){
	var source, props = Object.getOwnPropertyNames(this), i = 0, j = props.length, prop;

	seen = seen || [this];
	source = '({';
	for(;i<j;i++){
		prop = props[i];
		source+= prop.toSource() + ': ' + Object.sourceOf(this[prop], seen, '{}');
		if( i < j - 1 ) source += ', ';
	}
	source+= '})';

	return source;
};

Array.prototype.toSource = function(seen){
	var source, i = 0, j = this.length;

	seen = seen || [this];
	source = '[';
	for(;i<j;i++){
		source+= Object.sourceOf(this[i], seen, '[]');
		if( i < j - 1 ) source+= ', ';
	}
	source+= ']';

	return source;
};

// use non ennumerable and writable property
[Number, Boolean, RegExp, Date, String, Function, Error, Object, Array].forEach(function(constructor){
	Object.defineProperty(constructor.prototype, 'toSource', {
		writable: true,
		enumerable: false,
		value: constructor.prototype.toSource
	});
});

Math.toSource = function(){ return 'Math'; };

module.exports = Object.toSource;