(function(){
	

	var configuration = {};
	var askQueue = {};

	function merge(a, b){
		for (var key in b) {
			if (!a) {
				a = {};
			}
			if ('object' === typeof b[key]) {
				a[key] = merge(a[key], b[key]);
			} else {
				a[key] = b[key];
			}
		}
		return a;
	}

	function subProperty(obj, desc) {
		if (desc === "") {
			return obj;
		}
		var arr = desc.split(".");
		while(arr.length && (obj = obj[arr.shift()])) {}
		return obj;
	}

	var confity = {

		getModule: function getModule(module, callback) {

			if (callback === undefined) {
				throw "Given callback is undefined";
			}

			if (configuration[module] === undefined) {
				console.log("Application does not have any module named " + module + ", yet");
				if (askQueue[module] === undefined) {
					askQueue[module] = [];
				}
				askQueue[module].push(callback);
			} else {
				callback(configuration[module]);
			}

		},
		setModule: function setModule(module, config) {

			if (config === undefined) {
				throw "Given config is undefined";
			}

			var needCallback = false;
			if (configuration[module] === undefined) {
				configuration[module] = {};
				needCallback = true;
			}
			configuration[module] = merge(configuration[module], config);
			if (needCallback && askQueue[module] !== undefined) {
				askQueue[module].every(function(val) {
					val( configuration[module] );
				});
				askQueue[module] = [];
			}

			return true;

		},
		key: function key(module, k, v) {
			if (v === undefined){
				return configuration[module][k];
			}
			if (configuration[module] === undefined) {
				configuration[module] = {};
			}
			configuration[module][k] = v;
			return true;
		},
		/**
		* Synchrnous call, be sure the module you call have configuration
		* before call this function
		*/
		conf: function conf(module, key, obj) {
			if (configuration[module] === undefined) {
				throw "Application does not have any module named " + module;
			}
			if (typeof obj !== "object") {
				throw "Target is not an object";
			}
			var sub = subProperty(configuration[module], key);
			if (typeof sub !== "object") {
				throw "Key value is not an object";
			}
			merge(obj, sub);
		}

	};

	// Generic module export
	if (typeof define === 'function' && define.amd) {
		define('confity',[],function() {
			return confity;
		});
	} else if (typeof module !== 'undefined' && module.exports) {
		module.exports = confity;
	} else {
		this.confity = confity;
	}

}).call(this);


