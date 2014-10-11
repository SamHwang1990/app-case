/**
 * Created by sam on 14-10-10.
 */
var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');

var config = require('../../config').config;
var Student = require('../../proxy').Student;

exports.showStudentList = function(req,res,next){
	res.render('backend/studentMgr/list',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'学生列表 - 学生管理 - 后台管理 - ' + config.description
		}
	})
};
exports.ajaxStudentList = function(req,res,next){
	var proxy = eventproxy.create('students',
		function (students) {
			res.json(students);
		});
	proxy.fail(next);

	Student.getStudentsByQuery({},{sort:{name:-1}},proxy.done('students',function(students){
		return _.map(students, function(student){
			student.create_date = util.YYYYMMDDHHmmss(student.create_date);
			student.last_edit_date = util.YYYYMMDDHHmmss(student.last_edit_date);
			return student;
		});
	}))
};

exports.showNew = function(req,res,next){
	res.render('backend/studentMgr/new',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'添加学生 - 学生管理 - 后台管理 - ' + config.description
		}
	})
};
exports.newStudent = function(req,res,next){
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var name_en = validator.trim(req.body.name_en);
	name_en = sanitizer.sanitize(name_en);
	var email = validator.trim(req.body.email);
	email = email.toLowerCase();
	email = sanitizer.sanitize(email);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);

	var is_block = validator.trim(req.body.is_block);
	is_block = is_block === 'on'?true:false;

	var error_render = function(req, res){
		res.render('backend/userMgr/edit', {
			error: req.flash('error').toString(),
			isBack:true,
			topic:{
				title:'添加学生 - 学生管理 - 后台管理 - ' + config.description
			},
			name: name, email: email, name_en:name_en, remark:remark, is_block:is_block});
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
		req.flash('error','学生名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if (name_en.length < 1) {
		req.flash('error','学生英文名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if(!validator.isAlphanumeric(name_en)){
		req.flash('error','学生英文名只能使用0-9，a-z，A-Z。');
		error_render(req,res);
		return;
	}

	Student.getStudentByMail(email,function(err,student){
		if(err)
			return next(err);

		if(student !== null){
			req.flash('error','邮箱名已被占用。');
			error_render(req,res);
			return;
		}

		Student.newAndSave(name,name_en,email,is_block,remark,function(err, student){
			if(err)
				return next(err);

			res.redirect('/backend/StudentMgr/List');
			//res.redirect('/backend/StudentMgr/SortMgr/' + student._id);
		});
	});
};