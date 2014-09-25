/**
 * Created by sam on 14-9-24.
 */

var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');

var crypto = require('crypto');
var config = require('../../config').config;

var User = require('../../proxy').User;

//list
exports.showList = function(req, res, next){
	res.render('backend/userMgr/list',{
		isBack:true,
		topic:{
			title:'用户列表 - 后台管理 - ' + config.description
		}
	})
};
exports.ajaxList = function(req,res,next){
	var limit = parseInt(req.query.limit, 10) || 10;
	var offset = parseInt(req.query.offset, 10) || 0;

	var proxy = eventproxy.create('users',
		function (users) {
			res.json(users);
		});
	proxy.fail(next);

	User.getUsersByQuery({},{sort:{name:-1}},proxy.done('users',function(users){
		return _.map(users, function(user){
			user.create_date = util.YYYYMMDDHHmmss(user.create_date);
			user.last_login_date = user.last_login_date !== '' ? util.YYYYMMDDHHmmss(user.last_login_date) : '';
			return user;
		});
	}))
};