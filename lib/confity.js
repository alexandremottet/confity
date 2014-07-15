(function(){
	"use strict";

	var Promise = (typeof module !== 'undefined' && module.exports) ?
	require('es6-promise').Promise : this.Promise;

	var configuration = {};
	var queues;

	function getEnd(data) {
		queues.get.modules[data.name] = [];
	}

	function subEnd() {
		// nothing
	}

	function unique(value, index, self) { 
		return self.indexOf(value) === index;
	}

	function mergeObject(a, b){
		for (var key in b) {
			if (!a) {
				if (b instanceof Array) {
					a = [];
				} else {
					a = {};
				}
			}
			if (b[key] instanceof Array) {
				a[key] = a[key].concat(b[key]).filter(unique);
			} else if ('object' === typeof b[key]) {
				a[key] = mergeObject(a[key], b[key]);
			} else {
				a[key] = b[key];
			}
		}
		return a;
	}

	function subProperty(obj, key, value) {

		if (key === "") {
			return obj;
		}

		// string style : 'a.b.c'
		if (typeof key === 'string') {
			return subProperty(obj,key.split('.'), value);
		}
		// array style : ['a','b','c']
		else if (key.length===1 && value!==undefined) {
			return (obj[key[0]] = value);
		}
		// target key objet
		else if (key.length===0) {
			return obj;
		}
		// recursive
		else {
			return subProperty(obj[key[0]],key.slice(1), value);
		}
		
	}

	function unroll(data) {
		Object.keys(queues).forEach(function (queue) {
			var modules = queues[queue].modules;
			if (modules[data.name] !== undefined && modules[data.name].length > 0) {
				modules[data.name].forEach(function(caller) {
					caller( configuration[data.name] );
				});
				queues[queue].end(data);
			}
		});
	}

	function add(name, queue, caller) {
		var modules = queues[queue].modules;
		if (modules[name] === undefined) {
			modules[name] = [];
		}
		modules[name].push(caller);
	}

	// public object
	var confity = {

		setSubConf: function setSubConf(name, key, value) {
			if (configuration[name] === undefined) {
				configuration[name] = {};
			}
			subProperty(configuration[name], key, value);
			// configuration[name][key] = value;
			return true;
		},

		getSubConf: function getSubConf(name, key) {
			if (key === undefined) {
				key = '';
			}
			return subProperty(configuration[name], key);
		},

		mergeConf: function mergeConf(name, key, obj) {
			if (configuration[name] === undefined) {
				throw "Application does not have any name named " + name;
			}
			if (typeof obj !== "object") {
				throw "Target key not an object";
			}
			var sub = subProperty(configuration[name], key);
			if (typeof sub !== "object") {
				throw "Key value key not an object";
			}
			mergeObject(obj, sub);
		},

		setConf: function setConf(name, config) {

			configuration[name] = config;
			unroll({name: name});

		},

		getConf: function getConf(name, callback) {

			return new Promise(function(resolve){

				if (callback !== undefined) {
					resolve = callback;
				}

				if (configuration[name] === undefined) {
					add(name, 'get', callback);
				} else {
					resolve(configuration[name]);
				}

			});

		},

		subscribe: function subscribe(name, callback) {

			if (configuration[name] === undefined) {
				add(name, 'sub', callback);
			} else {
				callback(configuration[name]);
			}

		},

		size: function configurationSize() {
			return Object.keys(configuration).length;
		},

		clear: function clearConf(name) {
			if (name === undefined) {
				configuration = {};
			} else {
				delete configuration[name];
			}
		}

	};

	// Initialization
	queues = {
		get: {
			end: getEnd,
			modules: {}
		},
		sub: {
			end: subEnd,
			modules: {}
		}
	};

	// Generic module export
	if (typeof define === 'function' && define.amd) {
		define(function() {
			return confity;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = confity;
	} else {
		this.confity = confity;
	}

}).call(this);

