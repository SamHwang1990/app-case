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
            res.status.should.eql(200);
            res.text.should.containDeep(config.description);
            done(err);
        });
    });

    it('should /list 200',function(done){
       request.get('/list').end(function(err,res){
           res.status.should.eql(200);
           res.text.should.containDeep('student list');
           done(err);
       });
    });

    it('should /resume 200',function(done){
        request.get('/resume').end(function(err,res){
            res.status.should.eql(200);
            res.text.should.containDeep('student resume');
            done(err);
        });
    });

});