/**
 * Module dependencies.
 */

//var should = require('should');
var config = require('../../config').config;
var app = require('../../app');
var request = require('supertest')(app);


describe('test/controllers/site.test.js', function () {

    it('should / 200', function (done) {
        request.get('/').end(function (err, res) {
            res.status.should.equal(200);
            res.text.should.containDeep(config.description);
            done(err);
        });
    });

});