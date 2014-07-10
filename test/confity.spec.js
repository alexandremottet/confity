var chai = require('chai');
var fs = require('fs');
var confity = require('../lib/confity')

var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;

var conf = {}
var moduleName = 'TestModule';

describe('confity', function () {

    it('should exist', function() {

    	expect(confity).not.to.be.null;
    	assert.isObject(confity);

    });

    it('conf', function() {
    	var fn = function() { confity.conf(moduleName, '', conf); }
    	assert.throw(fn, 'Application does not have any module named ' + moduleName);
    });

    it('setModule', function() {
    	var newConf = {hello: 'Hello World !'};
    	confity.setModule(moduleName, newConf);
		confity.conf(moduleName, '', conf);
		expect(conf).to.be.eql(newConf);
    });

    it('getModule', function(done) {
    	confity.getModule('TestCallbackModule', function getModuleCallback(moduleConf) {
    		expect(moduleConf).to.be.eql(conf);
    		done();
    	});
    	confity.setModule('TestCallbackModule', conf);
    });

});
