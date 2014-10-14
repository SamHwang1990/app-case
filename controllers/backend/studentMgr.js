/**
 * Created by sam on 14-10-10.
 */
var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

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
			//还要检测学生的留学类型是否还存在，如果不存在了，则要删除学生的edu_type、sort_content 值
			var ep = new eventproxy();
			ep.fail(next);
			ep.all('get_details','get_type',function(details, type){
				if(type === null) {
					student.edu_type = null;
					student.sort_content = null;

					var ep2 = new eventproxy();
					ep2.fail(next);
					ep2.all('update_student','getTypes',function(updateResult, types){
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
						});
					});

					student.save(function(err){
						if(err)
							return ep2.emit('update_student',false);
						ep2.emit('update_student',true);
					});

					Sort.getSortsByQuery({grade:0},{'ancestors':-1,'parent_id':-1},ep2.done('getTypes'));
				}else
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
					});
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

exports.showEditResume = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		res.render('backend/studentMgr/editResume',{
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'编辑学生案例 - 学生管理 - 后台管理 - ' + config.description
			},
			Student:student
		})
	})
};
exports.editStudentResume = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var resumeImg = validator.trim(req.body.resumeImg);
	resumeImg = sanitizer.sanitize(resumeImg);

	Student.getStudentById(studentId,function(err,student) {
		if (err)
			return next(err);

		if (student === null) {
			req.flash('error', '信息出错，请刷新重新提交。');
			return res.redirect('/backend/StudentMgr/List');
		}

		student.resume_image = resumeImg;
		student.save(function(err){
			if(err)
				return next(err);

			return res.redirect('/backend/StudentMgr/List');
		})
	});
};

exports.showEssayList = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		return res.render('backend/studentMgr/showEssayList',{
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'学生文书列表 - 学生管理 - 后台管理 - ' + config.description
			},
			Student:student
		})
	});
};

exports.showNewEssayItem = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		res.render('backend/studentMgr/newEssayItem',{
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'新建学生文书 - 学生管理 - 后台管理 - ' + config.description
			},
			Student:student
		})
	})
};
exports.newEssayItem = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var essayTitle = validator.trim(req.body.essayTitle);
	essayTitle = sanitizer.sanitize(essayTitle);
	var essayContent = validator.trim(req.body.essayContent);
	essayContent = sanitizer.sanitize(essayContent);

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		var error_render = function(req, res){
			res.render('backend/studentMgr/newEssayItem', {
				error: req.flash('error').toString(),
				isBack:true,
				topic:{
					title:'新建学生文书 - 学生管理 - 后台管理 - ' + config.description
				},
				Student:student,essayTitle:essayTitle,essayContent:essayContent});
		};

		if(essayTitle === '' || essayContent === ''){
			req.flash('error','信息不完整。');
			error_render(req,res);
			return;
		}

		Student.getStudentsByQuery({
			'_id':studentId,
			'essay_list.title':essayTitle
		},{},function(err, students){
			if(students.length > 0){
				req.flash('error','文书标题已存在。');
				error_render(req,res);
				return;
			}
			var essayId = new ObjectId;
			student.essay_list.push({
				_id:essayId,
				title:essayTitle,
				content:essayContent
			});
			student.save(function(err){
				if(err)
					next(err);
				return res.redirect('/backend/StudentMgr/EssayList/' + studentId);
			});
		});


	});
};
exports.deleteEssayItem = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var essayId = validator.trim(req.params.essayId);

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);
		if(student === null){
			req.flash('error','学生信息不存在，请刷新页面！');
			res.render('notify/notify', {error: req.flash('error').toString()});
			return ;
		}

		Student.removeStudentEssayById(studentId,essayId,function(err, student){
			if(err)
				return next(err);
			req.flash('success','文书删除成功。');
			return res.redirect('/backend/StudentMgr/EssayList/' + studentId);
		});
	})
};