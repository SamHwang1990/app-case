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
	Sort.getEduTypes(function(err, types){
		if(err)
			return next(err);

		res.render('backend/sortMgr/list',{
			success:req.flash('success').toString(),
			isBack:true,
			eduTypes:types,
			topic:{
				title:'筛选列表 - 筛选管理 - 后台管理 - ' + config.description
			}
		})
	});
};
exports.showEduTypeDetails = function(req,res,next){
	var eduTypeId = req.params.typeId;
	eduTypeId = validator.trim(eduTypeId);
	Sort.getEduTypeDetails(eduTypeId,function(err,details){
		if(err)
			return next(err);
		console.log(typeof(details));
		res.json(details);
	});
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

	Sort.getSortsByQuery({
		grade:0,
		$or:[
			{name:name},
			{slug:slug}
		]
	},{},function(err, eduTypes){
		if(err)
			return next(err);
		if(eduTypes.length > 0){
			return res.json({
				SaveResult:false,
				ErrorMsg:'留学类型名或英文名已被占用。'
			});
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
exports.newEduTypeItemOrOption = function(req,res,next){
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var slug = validator.trim(req.body.slug);
	slug = sanitizer.sanitize(slug);
	var description = validator.trim(req.body.description);
	description = sanitizer.sanitize(description);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);
	var parentId = validator.trim(req.body.parentId);
	var grade = req.body.grade;

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

	if(grade === 0){
		return res.json({
			SaveResult:false,
			ErrorMsg:'分类创建失败，所提交信息有误，请刷新页面，重新提交！'
		});
	}

	Sort.getSortsByQuery({
		grade:1,
		parent_id:parentId,
		$or:[
			{name:name},
			{slug:slug}
		]
	},{},function(err, items){
		if(err)
			return next(err);
		if(items.length > 0){
			return res.json({
				SaveResult:false,
				ErrorMsg:'中文名或英文名已被占用。'
			});
		}

		Sort.newAndSaveEduTypeItemOrOption(name,slug,grade,description,remark,parentId,function(err, eduTypeItem){
			if(err)
				return next(err);
			if(eduTypeItem === null || typeof(eduTypeItem) === 'undefined')
				return res.json({
					SaveResult:false,
					ErrorMsg:'分类创建失败，所提交信息有误，请刷新页面，重新提交！'
				});

			res.json({
				SaveResult:true,
				SuccessMsg:'分类创建成功。',
				SortId:eduTypeItem._id
			});
			return;
		})
	})

};

//edit
exports.showEditEduType = function(req,res,next){
	var eduTypeId = req.params.typeId;
	eduTypeId = validator.trim(eduTypeId);

	Sort.getSortById(eduTypeId,function(err,sort){
		res.render('backend/sortMgr/edit',{
			error:req.flash('error').toString(),
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'编辑筛选分类 - 筛选管理 - 后台管理 - ' + config.description
			},
			_id:sort._id,
			name:sort.name,
			slug:sort.slug,
			description:sort.description,
			remark:sort.remark
		})
	});

};
exports.editEduType = function(req,res,next){
	var _id = validator.trim(req.body._id);
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var slug = validator.trim(req.body.slug);
	slug = sanitizer.sanitize(slug);
	var description = validator.trim(req.body.description);
	description = sanitizer.sanitize(description);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);

	if (_id === '' || name === '' || slug === '') {
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

	Sort.getSortById(_id,function(err,sort){
		if(err)
			return next(err);

		if(sort === null || sort === undefined)
			return res.json({
				SaveResult:false,
				ErrorMsg:'信息有错误，请刷新！'
			});

		Sort.getSortsByQuery({
			_id:{$ne:_id},
			grade:0,
			$or:[
				{name:name},
				{slug:slug}
			]
		},{},function(err,sorts){
			if(sorts.length > 0){
				return res.json({
					SaveResult:false,
					ErrorMsg:'留学类型名或英文名已被占用。'
				});
			}

			sort.name = name;
			sort.slug = slug;
			sort.description = description;
			sort.remark = remark;

			sort.save(function(err){
				if(err)
					return next(err);
				res.json({
					SaveResult:true,
					SuccessMsg:'留学类型保存成功。'
				});
				return;
			});
		})
	})

};
exports.editEduTypeItemOrOption = function(req,res,next){
	var sortId = req.body.sortId;
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var slug = validator.trim(req.body.slug);
	slug = sanitizer.sanitize(slug);
	var description = validator.trim(req.body.description);
	description = sanitizer.sanitize(description);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);

	if (sortId === '' || name === '' || slug === '') {
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

	Sort.getSortById(sortId,function(err,sort){
		if(err)
			return next(err);

		if(sort === null)
			return res.json({
				SaveResult:false,
				ErrorMsg:'所提交信息有误，请刷新页面，重新提交！'
			});

		Sort.getSortsByQuery({
			_id:{$ne:sortId},
			grade:sort.grade,
			parent_id:sort.parent_id,
			$or:[
				{name:name},
				{slug:slug}
			]
		},{},function(err,sorts){
			if(sorts.length > 0){
				return res.json({
					SaveResult:false,
					ErrorMsg:'中文名或英文名已被占用。'
				});
			}

			sort.name = name;
			sort.slug = slug;
			sort.description = description;
			sort.remark = remark;

			sort.save(function(err){
				if(err)
					return next(err);
				res.json({
					SaveResult:true,
					SuccessMsg:'数据保存成功。'
				});
				return;
			});
		})
	})
};
