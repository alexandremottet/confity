requirejs.config({
    baseUrl: '../dist', 
    paths: {
    	lib: '../demo/scripts/lib'
    }
});

require(["confiny", "lib"], function(confiny, lib) {

	confiny.setModule("confiny", {
		name:"confiny",
		complex: {
			id: 10,
			value: 10,
			sub: {
				value: "Hello World !"
			}
		}
	});

	confiny.getModule("confiny", function(val) {
		console.log("get confiny config : " + val.complex.id);
		console.log("get confiny config : " + val.complex.value);
	});

	confiny.getModule("lib", function(val) {
		console.log("get lib config : " + val.name);
	});

	confiny.setModule("confiny", {
		name:"confiny",
		complex: {
			id: 5
		}
	});

	confiny.getModule("confiny", function(val) {
		console.log("get confiny config : " + val.complex.id);
		console.log(val);
	});

	var test = {};
	confiny.conf("confiny","complex.sub", test);
	console.log(test);

});