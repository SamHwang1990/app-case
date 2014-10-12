/**
 * Created by sam on 14-10-10.
 */
var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');
var mongoose = require('mongoose');

var config = require('../../config').config;
var Student = require('../../proxy').Student;
var Sort = require('../../proxy').Sort;

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
	var profileImg = validator.trim(req.body.profileImg);
	profileImg = sanitizer.sanitize(profileImg);

	var error_render = function(req, res){
		res.render('backend/studentMgr/edit', {
			error: req.flash('error').toString(),
			isBack:true,
			topic:{
				title:'添加学生 - 学生管理 - 后台管理 - ' + config.description
			},
			name: name, email: email, name_en:name_en, remark:remark, is_block:is_block,profileImg:profileImg});
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

		Student.newAndSave(name,name_en,email,is_block,remark,profileImg,function(err, student){
			if(err)
				return next(err);

			return res.redirect('/backend/StudentMgr/List');
			//res.redirect('/backend/StudentMgr/SortMgr/' + student._id);
		});
	});
};

exports.showEdit = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		res.render('backend/studentMgr/edit',{
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'编辑学生信息 - 学生管理 - 后台管理 - ' + config.description
			},
			name:student.name,
			name_en:student.name_en,
			email:student.email,
			remark:student.remark,
			is_block:student.is_block,
			profileImg:student.profile_image
		})
	});
};
exports.editStudent = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

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
	var profileImg = validator.trim(req.body.profileImg);
	profileImg = sanitizer.sanitize(profileImg);

	var error_render = function(req, res){
		res.render('backend/studentMgr/edit', {
			error: req.flash('error').toString(),
			isBack:true,
			topic:{
				title:'编辑学生信息 - 学生管理 - 后台管理 - ' + config.description
			},
			name: name, email: email, name_en:name_en, remark:remark, is_block:is_block,profileImg:profileImg});
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

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		if(student === null){
			req.flash('error','信息出错，请刷新重新提交。');
			error_render(req,res);
			return;
		}

		Student.getStudentsByQuery({
			'_id':{$ne:studentId},
			'email':email
		},{},function(err,students){
			if(err)
				return next(err);

			if(students.length > 0){
				req.flash('error','邮箱名已被占用。');
				error_render(req,res);
				return;
			}

			student.name = name;
			student.name_en = name_en;
			student.email = email;
			student.remark = remark;
			student.profile_image = profileImg;
			student.is_block = is_block;

			student.save(function(err){
				if(err)
					return next(err);

				return res.redirect('/backend/StudentMgr/List');
				//res.redirect('/backend/StudentMgr/SortMgr/' + student._id);
			})
		})

	});
};

exports.delete = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

	Student.removeStudentById(studentId,function(err){
		if(err)
			return next(err);

		res.redirect('/backend/StudentMgr/List');
	})
};

exports.showEditSort = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		if(student.edu_type === null || typeof(student.edu_type) === 'undefined'){
			Sort.getSortsByQuery({grade:0},{'ancestors':-1,'parent_id':-1},function(err, types){
				if(err)
					return next(err);

				return res.render('backend/studentMgr/editSort',{
					success:req.flash('success').toString(),
					isBack:true,
					topic:{
						title:'编辑学生筛选信息 - 学生管理 - 后台管理 - ' + config.description
					},
					EduType:null,
					EduTypes:types,
					name:student.name,
					studentId:studentId
				})
			});
		}else{
			var ep = new eventproxy();
			ep.fail(next);
			ep.all('get_details','get_type',function(details, type){
				return res.render('backend/studentMgr/editSort',{
					success:req.flash('success').toString(),
					isBack:true,
					topic:{
						title:'编辑学生筛选信息 - 学生管理 - 后台管理 - ' + config.description
					},
					EduType:type,
					EduTypeDetails:details,
					name:student.name,
					studentId:studentId
				})
			});

			Sort.getEduTypeDetails(student.edu_type,ep.done('get_details'));
			Sort.getSortById(student.edu_type,ep.done('get_type'));
		}
	});
};
exports.editStudentSort = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var options = req.body.optionList;
	var eduTypeId = validator.trim(req.body.eduTypeId);

	var ep = new eventproxy();
	ep.fail(next);
	ep.all('get_eduType','get_student',function(eduType, student){
		if(eduType === null || eduType.grade !== 0)
			return res.json({
				'EditResult':false,
				'msg':"留学类型出错，请刷新页面，重新提交！"
			});

		if(student === null)
			return res.json({
				'EditResult':false,
				'msg':"学生信息出错，请刷新页面，重新提交！"
			})

		student.edu_type = eduTypeId;
		student.sort_content = options;
		student.save(function(err){
			if(err)
				return next(err);

			return res.json({
				'EditResult':true,
				'msg':"保存成功！"
			})
		})
	});

	Sort.getSortById(eduTypeId,ep.done('get_eduType'));
	Student.getStudentById(studentId,ep.done('get_student'));


};
exports.ajaxStudentSort = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		if(student === null){
			return res.json({
				'AjaxResult':false,
				'msg':"学生信息出错，请刷新页面，重新提交！"
			})
		}

		for(var i= 0;i < student.sort_content.length;i++){
			Sort.getSortById(student.sort_content[i],function(err,sort){
				if(sort === null)
					student.sort_content.splice(i,1);
			})
		}

		student.save(function(err){
			if(err)
				return next(err);

			return res.json({
				'AjaxResult':true,
				'StudentOptions':student.sort_content
			})
		})
	})
};