var chai = require('chai')
var fs = require('fs')
var Promise = require('es6-promise').Promise
var confity = require('../lib/confity')

var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;

var module1 = 'module1';
var module2 = 'module2';

var conf1 = {
    worker: "worker.js",
    words: ["yes","no"],
    values: {
        speed: {
            min: 0,
            max: 1
        },
        id: 10,
        unit: 0.05
    },
    size: 1
}
var conf2 = {
    size: 10
}
var conf3 = {
    words: ["yes","no","maybe"],
    values: {
        speed: {
            min: 0,
            max: 99
        }
    },
}
var conf1to3 = {
    worker: "worker.js",
    words: ["yes","no","maybe"],
    values: {
        speed: {
            min: 0,
            max: 99
        },
        id: 10,
        unit: 0.05
    },
    size: 1
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

describe('confity', function () {

    it('should exist : confity object should exist', function() {

    	expect(confity).not.to.be.null;
    	assert.isObject(confity);

    });

    it('setConf_1 : set configuration should work', function() {

        confity.setConf(module1, conf1);

        var tmp1 = confity.getSubConf(module1, '');
        expect(tmp1).not.to.be.null;

    });

    it('setConf_2 : configuration object should be independant', function() {

        confity.setConf(module1, conf1);
        confity.setConf(module2, conf1);
        confity.setSubConf(module1, 'values.speed.max', 1000);

        var tmp1 = confity.getSubConf(module1, '');
        var tmp2 = confity.getSubConf(module2, '');
        expect(tmp1).not.to.be.eql(tmp2);

        confity.setSubConf(module1, 'values.speed.max', conf1.values.speed.max);

    });

    it('getConf : confity should keep configuration', function(done) {
        confity.getConf(module1, function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });
    });

    it('getConf_promise : confity should keep configuration when use promises', function(done) {
        confity.getConf(module1).then(function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });
    });

    it('getConf_async : getConf callback should be call when setConf is call after', function(done) {

        // reset configuration
        confity.clear(module1);

        confity.getConf(module1, function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });

        confity.setConf(module1, conf1);

    });

    it('subscribe_1 : subscribe should be call eachtime setConf is call', function(done) {
        var i = 0;
        var expectConf;

        // reset configuration
        confity.clear(module1);

        confity.setConf(module1, conf1);

        confity.subscribe(module1, '', function(module) {
            if (i == 0) {
                expectConf = conf1;
            } else if (i == 1) {
                expectConf = conf2;
            }

            expect(module).to.be.eql(expectConf);
            i += 1;

            if (i == 2) {
                done();
            }
        });

        confity.setConf(module1, conf2);
    });

    it('subscribe_2 : subscribe should be call eachtime setConf is call after subscription', function(done) {

        var i = 0;
        var expectConf;

        // reset configuration
        confity.clear(module1);

        confity.subscribe(module1, '', function(module) {
            if (i == 0) {
                expectConf = conf1;
            } else if (i == 1) {
                expectConf = conf2;
            }

            expect(module).to.be.eql(expectConf);
            i += 1;

            if (i == 2) {
                done();
            }
        });

        confity.setConf(module1, conf1);
        confity.setConf(module1, conf2);

    });

    it('subscribe_3 : subscribe callback should be call when setSubConf is used', function(done) {
        var i = 0;
        var expectConf;
        var subConf;

        // reset configuration
        confity.clear(module1);

        confity.setConf(module1, conf1);

        confity.subscribe(module1, '', function(module) {
            if (i == 0) {
                expectConf = conf1;
                subConf = conf1;
            } else if (i == 1) {
                expectConf = {min: 0,max: 99};
                subConf = confity.getSubConf(module1, 'values.speed');
            } else if (i == 2) {
                expectConf = {min: 0,max: 42};
                subConf = confity.getSubConf(module1, 'values.speed');
            }

            expect(subConf).to.be.eql(expectConf);
            i += 1;

            if (i == 3) {
                done();
            }
        });

        confity.setSubConf(module1, 'values.speed', {min: 0,max: 99});
        confity.setSubConf(module1, 'values.speed', {min: 0,max: 42})   ;
    });

    it('subscribe_4 : subscribe callback should be only call when setSubConf is used on subscribe key', function(done) {
        var i = 0;
        var expectConf;
        var subConf;

        // reset configuration
        confity.clear(module1);

        confity.setConf(module1, conf1);

        confity.subscribe(module1, 'values.speed', function(module) {

            if (i == 1) {

                expectConf = {min: 0,max: 99};
                subConf = confity.getSubConf(module1, 'values.speed');

                expect(subConf).to.be.eql(expectConf);

            }

            i += 1;

            if (i == 2) {
                done();
            }
        });

        confity.setSubConf(module1, 'speed', 99);
        confity.setSubConf(module1, 'values.speed', {min: 0,max: 99});
    });

    it('getSubConf : should return a specific part of a configuration', function() {
        confity.setConf(module1, conf1);
        var value = confity.getSubConf(module1, 'values.id');
        assert.strictEqual(10, value);
    });

    it('setSubConf : should set a specific part of a configuration', function() {
        confity.setConf(module1, conf1);
        confity.setSubConf(module1, 'values.speed.max', 5);
        var value = confity.getSubConf(module1, 'values.speed.max');
        assert.strictEqual(5, value);
    });

    it('mergeConf_1 : should merge value', function() {

        var conf = clone(conf1);

        assert.strictEqual(1, conf.size);
        confity.setConf(module1, conf2);
        confity.mergeConf(module1, '', conf);
        assert.strictEqual(10, conf.size);

    });

    it('mergeConf_2 : should merge a complex data', function() {

        var conf = clone(conf1);

        confity.setConf(module1, conf3);
        confity.mergeConf(module1, '', conf);
        assert.deepEqual(conf, conf1to3);

    });

    it('mergeConf_3 : should embrace new configuration when conf object is empty', function() {

        var conf = {};

        confity.setConf(module1, conf3);
        confity.mergeConf(module1, '', conf);
        assert.deepEqual(conf, conf3);

    });

    it('size : size should give configuration number', function() {
        confity.setConf(module1, conf1);
        confity.setConf(module2, conf1);
        assert.strictEqual(2, confity.size());
    });

    it('clear_1 : clear a specific configuration should remove only one of them', function() {
        confity.clear(module1);
        assert.strictEqual(1, confity.size());
    });

    it('clear_all_1 : should clear all the configuration', function() {
        confity.clear();
        assert.strictEqual(0, confity.size());
    });

});
