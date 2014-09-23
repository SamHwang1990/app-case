/**
 * AppCase - sign controller.
 * Created by sam on 14-9-23.
 */
var validator = require('validator');
var eventproxy = require('eventproxy');

var crypto = require('crypto');

var User = require('../proxy').User;

//sign up
exports.showSignup = function (req, res) {
    res.render('sign/signup');
};