/**
 * Created by sam on 14-9-23.
 */

var config = require('../../config').config;
var app = require('../../app');
var request = require('supertest')(app);


describe('test/controllers/sign.test.js', function () {

    it('should /signup 200', function (done) {
        request.get('/signup').end(function (err, res) {
            res.status.should.eql(200);
            res.text.should.containDeep(config.description);
            done(err);
        });
    });

});