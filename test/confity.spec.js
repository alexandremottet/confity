var chai = require('chai')
var fs = require('fs')
var Promise = require('es6-promise').Promise
var confity = require('../lib/confity')

var should = chai.should();
var assert = chai.assert;
var expect = chai.expect;

var module1 = 'module1';
var module2 = 'module2';
var module3 = 'module3';
var module4 = 'module4';

var conf1 = {
    worker: "worker.js",
    words: ["yes","no"],
    values: {
        speed: {
            min: 0,
            max: 1
        },
        thickness: 10,
        unit: 0.05
    },
    size: 1
}
var conf2 = {
    size: 10
}
var conf3 = {
    worker: "worker.js",
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
        thickness: 10,
        unit: 0.05
    },
    size: 1
}

function clone(a) {
   return JSON.parse(JSON.stringify(a));
}

describe('confity', function () {

    it('should exist', function() {
    	expect(confity).not.to.be.null;
    	assert.isObject(confity);
    });

    it('setConf', function() {
        confity.setConf(module1, conf1);
    });

    it('getConf', function(done) {
        confity.getConf(module1, function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });
    });

    it('getConf_promise', function(done) {
        confity.getConf(module1).then(function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });
    });

    it('getConf_async', function(done) {
        confity.getConf(module3, function(module) {
            expect(module).to.be.eql(conf1);
            done();
        });
        confity.setConf(module3, conf1);
    });

    it('subscribe', function(done) {
        var i = 0;
        var expectConf;
        confity.subscribe(module2, function zerzer(module) {
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
        confity.setConf(module2, conf1);
        confity.setConf(module2, conf2);
    });

    it('clear', function() {
        var confNumber = confity.size();
        confity.clear(module1);
        assert.strictEqual(confNumber-1, confity.size());
    });

    it('clear_all', function() {
        confity.clear();
        assert.strictEqual(0, confity.size());
    });

    it('getSubConf', function() {
        confity.setConf(module4, conf1);
        var value = confity.getSubConf(module4, 'values.thickness');
        assert.strictEqual(10, value);
    });

    it('setSubConf', function() {
        confity.setConf(module4, conf1);
        confity.setSubConf(module4, 'values.speed.max', 5);
        var value = confity.getSubConf(module4, 'values.speed.max');
        assert.strictEqual(5, value);
    });

    it('mergeConf_1', function() {

        var conf = clone(conf1);
        confity.setConf(module4, conf2);

        assert.strictEqual(1, conf.size);
        confity.mergeConf(module4, '', conf);
        assert.strictEqual(10, conf.size);

    });

    it('mergeConf_2', function() {

        var conf = clone(conf1);
        confity.setConf(module4, conf3);

        confity.mergeConf(module4, '', conf);
        assert.deepEqual(conf, conf1to3);

    });

});
