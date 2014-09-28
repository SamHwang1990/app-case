/**
 * Created by sam on 14-9-26.
 */

var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');

var config = require('../../config').config;
var Sort = require('../../proxy').Sort;

//list
exports.showList = function(req,res,next){
	res.render('backend/sortMgr/list',{
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'筛选列表 - 筛选管理 - 后台管理 - ' + config.description
		}
	})
};


//new
exports.showNew = function(req,res,next){
	res.render('backend/sortMgr/new',{
		error:req.flash('error').toString(),
		success:req.flash('success').toString(),
		isBack:true,
		topic:{
			title:'增加筛选分类 - 筛选管理 - 后台管理 - ' + config.description
		}
	})
};

exports.newEduType = function(req,res,next){
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var slug = validator.trim(req.body.slug);
	slug = sanitizer.sanitize(slug);
	var description = validator.trim(req.body.description);
	description = sanitizer.sanitize(description);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);

	if (name === '' || slug === '') {
		res.json({
			SaveResult:false,
			ErrorMsg:'信息不完整。'
		});
		return;
	}

	if (name.length < 1) {
		res.json({
			SaveResult:false,
			ErrorMsg:'留学类型名至少需要1个字符。'
		});
		return;
	}

	if (slug.length < 1) {
		res.json({
			SaveResult:false,
			ErrorMsg:'留学类型英文名至少需要1个字符。'
		});
		return;
	}

	if(!validator.isAlphanumeric(slug)){
		res.json({
			SaveResult:false,
			ErrorMsg:'留学类型英文名只能使用0-9，a-z，A-Z。'
		});
		return;
	}

	Sort.getEduTypeByName(name, function(err, eduType){
		if(err)
			return next(err);

		if(eduType !== null){
			res.json({
				SaveResult:false,
				ErrorMsg:'留学类型名已被占用。'
			});
			return;
		}

		Sort.newAndSaveEduType(name, slug, description, remark, function(err, sort){
			if(err)
				return next(err);
			res.json({
				SaveResult:true,
				SuccessMsg:'留学类型新建成功。'
			});
			return;
		});
	});
};
