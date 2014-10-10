/**
 * Created by sam on 14-9-24.
 */

var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');

var crypt = require('../../libs/crypt');
var config = require('../../config').config;

var User = require('../../proxy').User;

//list
exports.showList = function(req, res, next){
	res.render('backend/userMgr/list',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'用户列表 - 用户管理 - 后台管理 - ' + config.description
		}
	})
};
exports.ajaxList = function(req,res,next){

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

//edit
exports.showEdit = function(req, res, next){
	var email = validator.trim(req.params.user_email);
	User.getUserByMail(email,function(err, user){
		res.render('backend/userMgr/edit',{
			isBack:true,
			topic:{
				title:'编辑用户信息- 用户管理 - 后台管理 - ' + config.description
			},
			user_id:user._id,
			avatar:user.avatar,
			name:user.name,
			name_en:user.name_en,
			email:email
		})
	})
};
exports.edit = function(req, res, next){
	var origin_email = validator.trim(req.params.user_email);

	var user_id = validator.trim(req.body.user_id);
	user_id = sanitizer.sanitize(user_id);
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var name_en = validator.trim(req.body.name_en);
	name_en = sanitizer.sanitize(name_en);
	var email = validator.trim(req.body.email);
	email = email.toLowerCase();
	var pass = validator.trim(req.body.pass);
	pass = sanitizer.sanitize(pass);
	email = sanitizer.sanitize(email);
	var pass_repeat = validator.trim(req.body.pass_repeat);
	pass_repeat = sanitizer.sanitize(pass_repeat);

	var avatar = validator.trim(req.body.avatar);

	var active = validator.trim(req.body.active);
	active = active === 'on'?false:true;

	var error_render = function(req, res){
		res.render('backend/userMgr/edit', {
			error: req.flash('error').toString(),
			isBack:true,
			topic:{
				title:'编辑用户信息- 用户管理 - 后台管理 - ' + config.description
			},
			user_id:user_id,avatar:avatar,name: name, email: email, name_en:name_en});
	};

	if (name === '' || name_en === '' ||  email === '') {
		req.flash('error','信息不完整。');
		error_render(req,res);
		return;
	}

	if(!validator.isEmail(email)){
		req.flash('error','不正确的电子邮箱。');
		error_render(req,res);
		return;
	}

	if (name.length < 1) {
		req.flash('error','用户名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if (name_en.length < 1) {
		req.flash('error','用户英文名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if(!validator.isAlphanumeric(name_en)){
		req.flash('error','用户英文名只能使用0-9，a-z，A-Z。');
		error_render(req,res);
		return;
	}

	if(pass !== ''){
		if (pass !== pass_repeat) {
			req.flash('error','两次密码输入不一致。');
			error_render(req,res);
			return;
		}
	}

	if(email !== origin_email){
		User.getUserByMail(email,function(err,user){
			if(err)
				return next(err);

			if(user !== null){
				req.flash('error','邮箱名已被占用。');
				error_render(req,res);
				return;
			}
		});
	}

	User.getUserByMail(origin_email,function(err,user){
		if(err)
			return next(err);

		// md5 the pass
		pass = crypt.md5(pass);
		//create gravatar
		var avatar_url = User.makeGravatar(email);

		user.email = email;
		user.name = name;
		user.name_en = name_en;
		user.pass = pass;
		user.avatar = avatar_url;
		user.active = active;

		user.save(function(err){
			if(err){
				return next(err);
			}

			req.flash('success','用户信息保存成功。');
			res.redirect('/backend/UserMgr/List');
			return;
		});
	});

};

exports.showNew = function(req, res, next){
	res.render('backend/userMgr/new',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'添加用户 - 用户管理 - 后台管理 - ' + config.description
		}
	})
};

exports.new = function(req, res, next){
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var name_en = validator.trim(req.body.name_en);
	name_en = sanitizer.sanitize(name_en);
	var email = validator.trim(req.body.email);
	email = email.toLowerCase();
	var pass = validator.trim(req.body.pass);
	pass = sanitizer.sanitize(pass);
	email = sanitizer.sanitize(email);
	var pass_repeat = validator.trim(req.body.pass_repeat);
	pass_repeat = sanitizer.sanitize(pass_repeat);

	var active = validator.trim(req.body.active);
	active = active === 'on'?false:true;

	var error_render = function(req, res){
		res.render('backend/userMgr/new', {
			error: req.flash('error').toString(),
			isBack:true,
			topic:{
				title:'添加用户 - 用户管理 - 后台管理 - ' + config.description
			},
			name: name,
			email: email,
			name_en:name_en});
	};

	if (name === '' || name_en === '' || pass === '' || pass_repeat === '' || email === '') {
		req.flash('error','信息不完整。');
		error_render(req,res);
		return;
	}

	if(!validator.isEmail(email)){
		req.flash('error','不正确的电子邮箱。');
		error_render(req,res);
		return;
	}

	if (name.length < 1) {
		req.flash('error','用户名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if (name_en.length < 1) {
		req.flash('error','用户英文名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if(!validator.isAlphanumeric(name_en)){
		req.flash('error','用户英文名只能使用0-9，a-z，A-Z。');
		error_render(req,res);
		return;
	}

	if (pass !== pass_repeat) {
		req.flash('error','两次密码输入不一致。');
		error_render(req,res);
		return;
	}

	User.getUserByMail(email,function(err,user){
		if(err)
			return next(err);

		if(user !== null){
			req.flash('error','邮箱名已被占用。');
			error_render(req,res);
			return;
		}

		// md5 the pass
		pass = crypt.md5(pass);
		//create gravatar
		var avatar_url = User.makeGravatar(email);

		User.newAndSave(name,name_en,pass,email,avatar_url,true,Date(),null,function(err, user){
			if (err) {
				return next(err);
			}
			res.redirect('/backend/UserMgr/List');
			//res.render('notify/notify', {success: '注册成功，请登录！'});
		});
	});
}

exports.delete = function(req,res,next){
	var email = validator.trim(req.params.user_email);
	email = sanitizer.sanitize(email);

	User.removeUserByEmail(email,function(err){
		if(err)
			return next(err);

		res.redirect('/backend/UserMgr/List');
	})
};