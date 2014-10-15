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

/*
 * 渲染StudentList 页面，这里不会传数据，交给ajaxStudentList 相应ajax请求
 * */
exports.showStudentList = function(req,res,next){
	res.render('backend/studentMgr/list',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'学生列表 - 学生管理 - 后台管理 - ' + config.description
		}
	})
};
/*
* 从数据库中读取所有Student 的信息，并返回json 数据
* */
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
/*
* 渲染New Student 页面
* */
exports.showNew = function(req,res,next){
	res.render('backend/studentMgr/new',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'添加学生 - 学生管理 - 后台管理 - ' + config.description
		}
	})
};
/*
* 接受POST 过来的New Student 信息，进行验证和Save
* */
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

	//检测Email 是否已存在
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
/*
* 相应GET 请求，渲染Edit Student 页面
* */
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
/*
* 接受POST 请求，处理Edit Student，进行验证和Update
* */
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

	//检测学生信息是否存在
	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		if(student === null){
			req.flash('error','信息出错，请刷新重新提交。');
			error_render(req,res);
			return;
		}


		/*
		* 查询是否存在一条记录，id 不是学生的id，email 地址与请求中的email 地址一样
		* 如果有，则表示邮箱地址重复，报错！
		* 否则，可以保存email
		* */
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
			student.last_edit_date = Date();

			student.save(function(err){
				if(err)
					return next(err);

				return res.redirect('/backend/StudentMgr/List');
				//res.redirect('/backend/StudentMgr/SortMgr/' + student._id);
			})
		})

	});
};
/*
* 接受GET 请求，根据学生ID 进行验证和Delete
* */
exports.delete = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

	Student.removeStudentById(studentId,function(err){
		if(err)
			return next(err);

		res.redirect('/backend/StudentMgr/List');
	})
};
/*
 * 相应GET 请求，渲染Edit Student Sort 页面
 * */
exports.showEditSort = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		/*
		* 检测当前学生的留学类型为空
		* 是，则从Sorts 中查找所有EduType，并传入模板渲染
		* 否，则获取其EduType 及EduType 的Details，还要进行验证这些数据是否还存在数据库
		* */
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
			//还要检测学生的留学类型是否还存在Sort集合中，如果不存在了，则要删除学生的edu_type、sort_content 值
			var ep = new eventproxy();
			ep.fail(next);
			ep.all('get_details','get_type',function(details, type){
				//如果根据学生的edu_type 查找到的Sort 为空，则清空edu_type 和 sort_content 的内容
				//然后从Sorts 集合中查找所有EduType，并传入模板
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
/*
* 接受POST 请求，处理Edit Student Sort，进行验证和Update
* */
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
		student.last_edit_date = Date();
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
/*
* 响应AJAX 请求，从Sorts 集合中获取学生的sort_content
* */
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

		/*
		* 检测sort_content 中所有的options 是否还存在Sorts 集合中
		* 如果否，则从student.sort_content 中删掉
		* */
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
/*
* 相应GET 请求，渲染Edit Student Resume 页面
* */
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
/*
* 接受POST 请求，处理Edit Student Resume，进行验证和Update
* */
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
		student.last_edit_date = Date();
		student.save(function(err){
			if(err)
				return next(err);

			return res.redirect('/backend/StudentMgr/List');
		})
	});
};
/*
* 相应GET 请求，渲染Edit Student Essay List 页面
* */
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
/*
 * 相应GET 请求，渲染New Student Essay 页面
 * */
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
/*
 * 接受POST 请求，处理new Student Essay，进行验证和Save
 * */
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

		//检测student 的essay_list 中是否有同名的Essay
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
/*
 * 接受GET 请求，根据学生ID 和Essay Item ID 进行验证和Delete
 * */
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
/*
 * 相应GET 请求，渲染Edit Student Essay 页面
 * */
exports.showEditEssayItem = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var essayId = validator.trim(req.params.essayId);

	//检测student 的essay_list 中是否有给定ID 的文书
	Student.getStudentsByQuery({
		'_id':studentId,
		'essay_list._id':ObjectId(essayId)
	},{},function(err, students){
		if(err)
			return next(err);

		if(students.length <= 0){
			req.flash('error','信息错误，请返回文书列表！');
			res.render('notify/notify', {error: req.flash('error').toString()});
			return;
		}

		//返回student 的essay_list 中包含给定ID 的文书对象
		var essay = students[0].essay_list.filter(function (essay) {
			return essay._id.toString() === ObjectId(essayId).toString();
		}).pop();

		res.render('backend/studentMgr/editEssayItem',{
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'修改学生文书 - 学生管理 - 后台管理 - ' + config.description
			},
			Student:students[0],
			essayTitle:essay.title,essayContent:essay.content})
	});
};
/*
 * 接受POST 请求，处理edit Student Essay，进行验证和Update
 * */
exports.editEssayItem = function(req,res,next){
	var studentId = validator.trim(req.params.studentId);
	var essayId = validator.trim(req.params.essayId);

	var essayTitle = validator.trim(req.body.essayTitle);
	essayTitle = sanitizer.sanitize(essayTitle);
	var essayContent = validator.trim(req.body.essayContent);
	essayContent = sanitizer.sanitize(essayContent);

	//检测student 的essay_list 中是否有包含给定ID 的文书
	Student.getStudentsByQuery({
		'_id':studentId,
		'essay_list._id':ObjectId(essayId)
	},{},function(err, students){
		if(err)
			return next(err);

		if(students.length <= 0){
			req.flash('error','信息错误，请返回文书列表！。');
			res.render('notify/notify', {error: req.flash('error').toString()});
			return;
		}

		var student = students[0];
		var error_render = function(req, res){
			res.render('backend/studentMgr/editEssayItem', {
				error: req.flash('error').toString(),
				isBack:true,
				topic:{
					title:'修改学生文书 - 学生管理 - 后台管理 - ' + config.description
				},
				Student:student,essayTitle:essayTitle,essayContent:essayContent});
		};

		//检测student 的essay_list 是否存在不同ID，但有一样标题的essay，如果有，则报错，文书标题重复
		var tempEssay = student.essay_list.filter(function (tempEssay) {
			return tempEssay._id.toString() !== ObjectId(essayId).toString() && tempEssay.title === essayTitle;
		}).pop();
		if(typeof(tempEssay) !== 'undefined'){
			req.flash('error','文书标题已存在。');
			error_render(req,res);
			return;
		}

		Student.updateStudentEssayItem(studentId,essayId,essayTitle,essayContent,function(err){
			if(err)
				return next(err);
			return res.redirect('/backend/StudentMgr/EssayList/' + studentId);
		});
	});
};