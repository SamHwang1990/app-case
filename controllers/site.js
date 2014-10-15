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
		ep.all('get_firstDetail',function(details){
			return res.render('frontend/index',{
				success:req.flash('success'),
				topic:{
					title:config.description
				},
				CurrentType:types[0],
				Details:details
			});
		});

		Sort.getEduTypeDetails(types[0]._id,ep.done('get_firstDetail'));
	});
};

exports.showEduType = function(req,res,next){
	var typeId = req.params.typeId;

	var ep = new eventproxy();
	ep.fail(next);
	ep.all('get_typeDetail','get_currentType',function(details,currentType){
		return res.render('frontend/index',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			CurrentType:currentType,
			Details:details
		});
	});

	Sort.getEduTypeDetails(typeId,ep.done('get_typeDetail'));
	Sort.getSortById(typeId,ep.done('get_currentType'));
};

exports.showOptionStudentList = function(req,res,next){
	var typeId = req.params.typeId;
	var optionId = req.params.optionId;
	var listPage = req.params.page;

	if(listPage === null || listPage === '' || !validator.isInt(listPage))
		listPage = 1;
	else
		listPage = parseInt(listPage);

	Student.getStudentsByQuery({
		'sort_content':optionId
	},{
		skip:(listPage-1) * 8,
		limit:8
	},function(err, students){
		if(err)
			next(err);
		return res.render('frontend/index',{
			success:req.flash('success'),
			topic:{
				title:config.description
			},
			Students:students,
			EduTypeId:typeId,
			CurrentPage:listPage
		});
	})
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