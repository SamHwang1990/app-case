/**
 * Created by sam on 14-9-23.
 */

var User = require('../../proxy/user');
var should = require('should');
var support = require('../support/support');

describe('/proxy/user',function(){
    describe('getUserByName', function () {
        it('should ok', function (done) {
            User.getUserByName('sam', function (err, user2) {
                should.not.exist(err);
                // TODO: check user
                (user2 === null).should.be.true;
                done();
            });
        });
    });

    describe('getUserByMail', function () {
        it('should ok', function (done) {
            User.getUserByMail('shyvo1987@gmail.com', function (err, user) {
                should.not.exist(err);
                // TODO: check user
                (user === null).should.be.true;
                done();
            });
        });
    });

    describe('getUsersByIds', function () {

        it('should ok with empty list', function (done) {
            User.getUsersByIds([], function (err, list) {
                should.not.exist(err);
                list.should.have.length(0);
                done();
            });
        });
    });
});