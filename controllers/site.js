/*
* AppCase - site index controller.
* Copyright(c) 2014 samhwang1990@gmail.com
* */

var validator = require('validator');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var config = require('../config').config;
var Student = require('../proxy').Student;
var Sort = require('../proxy').Sort;

exports.index = function(req,res,next){
	Sort.getEduTypes(function(err,types){
		if(err)
			return next(err);

		var ep = new eventproxy();
		ep.fail(next);
		ep.all('get_firstItem',function(items){
			return res.render('frontend/index',{
				success:req.flash('success'),
				topic:{
					title:config.description
				},
				CurrentType:types[0],
				Items:items
			});
		});

		Sort.getEduTypeItems(types[0]._id,ep.done('get_firstItem'));
	});
};

exports.showEduType = function(req,res,next){
	var typeId = req.params.typeId;

	var ep = new eventproxy();
	ep.fail(next);
	ep.all('get_typeItems','get_currentType',function(items,currentType){
		return res.render('frontend/index',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			CurrentType:currentType,
			Items:items
		});
	});

	Sort.getEduTypeItems(typeId,ep.done('get_typeItems'));
	Sort.getSortById(typeId,ep.done('get_currentType'));
};

exports.showEduTypeItemOptions = function(req,res,next){
	var typeId = req.params.typeId;
	var itemId = req.params.itemId;

	var ep = new eventproxy();
	ep.fail(next);
	ep.all('get_typeItemOptions','get_currentTypeItem',function(options,item){
		res.render('frontend/itemOptions',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			CurrentType:typeId,
			Options:options,
			Item:item
		});
	});

	Sort.getEduTypeItemOptions(itemId,ep.done('get_typeItemOptions'));
	Sort.getSortById(itemId,ep.done('get_currentTypeItem'));
};

exports.showOptionStudentList = function(req,res,next){
	var typeId = req.params.typeId;
	var optionId = req.params.optionId;
	var listPage = req.params.page;
	var studentPerPage = 8;

	if(listPage === null || listPage === '' || !validator.isInt(listPage))
		listPage = 1;
	else
		listPage = parseInt(listPage);

	var ep = new eventproxy();
	ep.fail(next);
	ep.all('get_studentCount','get_currentStudentList',function(total,students){
		return res.render('frontend/studentList',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			Students:students,
			EduTypeId:typeId,
			SortOptionId:optionId,
			CurrentPage:listPage,
			IsFirstPage:listPage == 1,
			IsLastPage:((listPage-1)*studentPerPage + students.length) >= total
		});
	});

	Student.getStudentsByQuery({'sort_content':optionId},{sort:{'last_edit_date':-1},skip:(listPage-1) * studentPerPage,limit:studentPerPage},ep.done('get_currentStudentList'));
	Student.getStudentCountBySort(optionId,ep.done('get_studentCount'));
};

exports.showStudentResume = function(req,res,next){
	var studentId = req.params.studentId;

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		return res.render('frontend/studentResume',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			studentId:studentId,
			name:student.name,
			name_en:student.name_en,
			eduTypeId:student.edu_type,
			essayList:student.essay_list,
			remark:student.remark,
			resumeImg:student.resume_image
		});
	});
};
exports.showStudentEssayList = function(req,res,next){
	var studentId = req.params.studentId;

	Student.getStudentById(studentId,function(err,student){
		if(err)
			return next(err);

		return res.render('frontend/studentEssayList',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			studentId:studentId,
			name:student.name,
			name_en:student.name_en,
			eduTypeId:student.edu_type,
			essayList:student.essay_list,
			remark:student.remark
		});
	});
};



exports.list = function(req,res,next){
    res.render('list',{
        topic:{
            title:'student list'
        }
    });
};

exports.resume = function(req,res,next){
    res.render('resume',{
        topic:{
            title:'student resume'
        }
    });
};