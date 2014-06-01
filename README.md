![logo](/demo/images/confity.png?raw=true)

confity.js
=======

A simple and lightweight library to manager custom configuration for your javascript module in your web application.

## usage

#### set module configuration
```
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
```

#### get module configuration
if you tried to get the configuration of module "lib" and it has not registered its own configuration then a callback function will be called.
```
	confiny.getModule("lib", function(conf) {
		console.log("lib configuration is get through this callback function");
	});
```

![logo](/demo/images/confity-logo.png?raw=true)
