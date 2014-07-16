(function(){
	"use strict";

	var Promise = (typeof module !== 'undefined' && module.exports) ?
	require('es6-promise').Promise : this.Promise;

	var configuration = {};
	var queues;

	/**
	 * Unique filter for merging tool
	 */
	function unique(value, index, self) { 
		return self.indexOf(value) === index;
	}

	/**
	 * Clone a JSON object to avoid 'reference'
	 */
	function clone(conf) {
		return JSON.parse(JSON.stringify(conf));
	}

	/**
	 * Reset subscriptions queues
	 * @param name Optional.
	 */
	function resetQueues(name) {
		Object.keys(queues).forEach(function (queue) {
			queue = queues[queue];
			if (name !== undefined) {
				if (queue.modules[name] !== undefined) {
					delete queue.modules[name];
				}
			} else {
				queue.modules = {};
			}
		});
	}

	/**
	 * Merge two object.
	 * b object have priority over a
	 */
	function mergeObject(a, b){
		for (var key in b) {
			if (a === undefined) {
				if (b instanceof Array) {
					a = [];
				} else {
					a = {};
				}
			}
			if (b[key] instanceof Array) {
				if (a[key] === undefined) {
					a[key] = [];
				}
				a[key] = a[key].concat(b[key]).filter(unique);
			} else if ('object' === typeof b[key]) {
				a[key] = mergeObject(a[key], b[key]);
			} else {
				a[key] = b[key];
			}
		}
		return a;
	}

	/**
	 * Get or set a sub property of a JSON object
	 * @param value Optional.
	 */
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
			var var1 = obj[key[0]];
			var var2 = key.slice(1);
			return subProperty(var1, var2, value);
		}

	}

	/**
	 * Add a listener on a specific queue
	 * data : {
	 *	name: 'configuration name',
	 *	key: 'the subkey',
	 *	callback: 'the callback when all the subs keys of key change in configuration'
	 * }
	 */
	function add(queue, data) {
		var modules = queues[queue].modules;
		if (modules[data.name] === undefined) {
			modules[data.name] = [];
		}
		modules[data.name].push(data);
	}

	function unroll(data) {
		Object.keys(queues).forEach(function (queue) {
			var modules = queues[queue].modules;
			if (modules[data.name] !== undefined && modules[data.name].length > 0) {
				modules[data.name].forEach(function(caller) {
					if (data.key.indexOf(caller.key) === 0) {
						caller.callback( configuration[data.name] );
					}
				});
				queues[queue].end(data);
			}
		});
	}

	// public object
	var confity = {

		setConf: function setConf(name, config) {

			configuration[name] = clone(config);
			unroll({
				name: name,
				key: ''
			});

		},

		setSubConf: function setSubConf(name, key, value) {
			subProperty(configuration[name], key, clone(value));
			unroll({
				name: name,
				key: key
			});
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

		getConf: function getConf(name, callback) {

			return new Promise(function(resolve){

				if (callback !== undefined) {
					resolve = callback;
				}

				if (configuration[name] === undefined) {
					add('get', {
						name: name,
						callback: callback,
						key: ''
					});
				} else {
					resolve(configuration[name]);
				}

			});

		},

		subscribe: function subscribe(name, key, callback) {

			add('sub', {
				name: name,
				callback: callback,
				key: key
			});
			if (configuration[name] !== undefined) {
				callback(configuration[name]);
			}

		},

		size: function configurationSize() {
			return Object.keys(configuration).length;
		},

		clear: function clearConf(name) {
			if (name === undefined) {
				configuration = {};
				resetQueues(name);
			} else {
				delete configuration[name];
				resetQueues(name);
			}
		}

	};

	// Initialization
	queues = {
		get: {
			end: function getEnd(data) {
				queues.get.modules[data.name] = [];
			},
			modules: {}
		},
		sub: {
			end: function subEnd() {
				// nothing
			},
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

