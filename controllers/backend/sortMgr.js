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
			title:'增加留学类型 - 筛选管理 - 后台管理 - ' + config.description
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
	var importance = validator.trim(req.body.importance);
	importance = sanitizer.sanitize(importance);

	var error_render = function(req, res){
		res.render('backend/sortMgr/new', {
			error: req.flash('error').toString(),
			success: req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'增加留学类型 - 筛选管理 - 后台管理 - ' + config.description
			},
			name:name,slug:slug,name: name, description: description, remark:remark});
	};

	if (name === '' || slug === '') {
		req.flash('error','信息不完整。');
		error_render(req,res);
		return;
	}

	if (name.length < 1) {
		req.flash('error','留学类型名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if (slug.length < 1) {
		req.flash('error','留学类型英文名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if(!validator.isAlphanumeric(slug)){
		req.flash('error','留学类型英文名只能使用0-9，a-z，A-Z。');
		error_render(req,res);
		return;
	}

	if(importance === ''){
		importance = 5;
	}else{
		if(!validator.isInt(importance)){
			req.flash('error','重要性指数只能是1-5 的整数');
			error_render(req,res);
			return;
		}else{
			importance = parseInt(importance);
			if(importance < 1 || importance > 5){
				req.flash('error','重要性指数只能是1-5 的整数');
				error_render(req,res);
				return;
			}
		}
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
			req.flash('error','留学类型名或英文名已被占用。');
			error_render(req,res);
			return;
		}

		Sort.newAndSaveEduType(name, slug, description, remark, importance, function(err, sort){
			if(err)
				return next(err);

			req.flash('success','留学类型保存成功。');
			res.redirect('/backend/SortMgr/EditDetails/' + sort._id);
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
			ErrorMsg:'中文名至少需要1个字符。'
		});
		return;
	}

	if (slug.length < 1) {
		res.json({
			SaveResult:false,
			ErrorMsg:'英文名至少需要1个字符。'
		});
		return;
	}

	if(!validator.isAlphanumeric(slug)){
		res.json({
			SaveResult:false,
			ErrorMsg:'英文名只能使用0-9，a-z，A-Z。'
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
		grade:grade,
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

			var msgPrefix = grade == 1?'筛选分类':'分类选项';
			res.json({
				SaveResult:true,
				SuccessMsg:msgPrefix + '创建成功。',
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
				title:'编辑留学类型 - 筛选管理 - 后台管理 - ' + config.description
			},
			_id:sort._id,
			name:sort.name,
			slug:sort.slug,
			importance:sort.importance,
			description:sort.description,
			remark:sort.remark
		})
	});

};
exports.showEditEduTypeDetails = function(req,res,next){
	var eduTypeId = req.params.typeId;
	eduTypeId = validator.trim(eduTypeId);
	Sort.getSortById(eduTypeId,function(err, type){
		if(err)
			return next(err);

		res.render('backend/sortMgr/editDetails',{
			error:req.flash('error').toString(),
			success:req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'编辑留学类型筛选细节 - 筛选管理 - 后台管理 - ' + config.description
			},
			typeId:eduTypeId,
			typeName:type.name
		});
	});
};
exports.editEduType = function(req,res,next){
	var _id = validator.trim(req.body.eduTypeId);
	var name = validator.trim(req.body.name);
	name = sanitizer.sanitize(name);
	var slug = validator.trim(req.body.slug);
	slug = sanitizer.sanitize(slug);
	var description = validator.trim(req.body.description);
	description = sanitizer.sanitize(description);
	var remark = validator.trim(req.body.remark);
	remark = sanitizer.sanitize(remark);
	var importance = validator.trim(req.body.importance);
	importance = sanitizer.sanitize(importance);

	var error_render = function(req, res){
		res.render('backend/sortMgr/edit', {
			error: req.flash('error').toString(),
			success: req.flash('success').toString(),
			isBack:true,
			topic:{
				title:'编辑留学类型 - 筛选管理 - 后台管理 - ' + config.description
			},
			_id:_id,name:name,slug:slug,name: name, description: description, remark:remark});
	};

	if (_id === '' || name === '' || slug === '') {
		req.flash('error','信息不完整。');
		error_render(req,res);
		return;
	}

	if (name.length < 1) {
		req.flash('error','留学类型名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if (slug.length < 1) {
		req.flash('error','留学类型英文名至少需要1个字符。');
		error_render(req,res);
		return;
	}

	if(!validator.isAlphanumeric(slug)){
		req.flash('error','留学类型英文名只能使用0-9，a-z，A-Z。');
		error_render(req,res);
		return;
	}

	if(importance === ''){
		importance = 5;
	}else{
		if(!validator.isInt(importance)){
			req.flash('error','重要性指数只能是1-5 的整数');
			error_render(req,res);
			return;
		}else{
			importance = parseInt(importance);
			if(importance < 1 || importance > 5){
				req.flash('error','重要性指数只能是1-5 的整数');
				error_render(req,res);
				return;
			}
		}
	}

	Sort.getSortById(_id,function(err,sort){
		if(err)
			return next(err);

		if(sort === null || sort === undefined) {
			req.flash('error','信息有错误，请刷新！');
			error_render(req,res);
			return;
		}

		Sort.getSortsByQuery({
			_id:{$ne:_id},
			grade:0,
			$or:[
				{name:name},
				{slug:slug}
			]
		},{},function(err,sorts){
			if(sorts.length > 0){
				req.flash('error','留学类型名或英文名已被占用。');
				error_render(req,res);
				return;
			}

			sort.name = name;
			sort.slug = slug;
			sort.importance = importance;
			sort.description = description;
			sort.remark = remark;

			sort.save(function(err){
				if(err)
					return next(err);
				Sort.updateAncestor({
					_id:sort._id,
					name:name,
					slug:slug,
					description:description,
					remark:remark,
					grade:sort.grade
				},function(err,numberAffected){
					if(err)
						return next(err);

					req.flash('success','留学类型保存成功。');
					res.redirect('/backend/SortMgr/EditDetails/' + _id);
					return;
				});
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
			ErrorMsg:'中文名至少需要1个字符。'
		});
		return;
	}

	if (slug.length < 1) {
		res.json({
			SaveResult:false,
			ErrorMsg:'英文名至少需要1个字符。'
		});
		return;
	}

	if(!validator.isAlphanumeric(slug)){
		res.json({
			SaveResult:false,
			ErrorMsg:'英文名只能使用0-9，a-z，A-Z。'
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

				Sort.updateAncestor({
					_id:sort._id,
					name:name,
					slug:slug,
					description:description,
					remark:remark,
					grade:sort.grade
				},function(err,numberAffected){
					if(err)
						return next(err);

					var msgPrefix = sort.grade == 1?'筛选分类':'分类选项';
					return res.json({
						SaveResult:true,
						SuccessMsg:msgPrefix + '保存成功。'
					});
				});
			});
		})
	})
};

//remove
exports.removeEduType = function(req,res,next){
	var typeId = validator.trim(req.body.sortId);
	Sort.removeEduType(typeId,function(err, removeResult){
		if(err)
			return next(err);

		return res.json({
			RemoveResult:true,
			SuccessMsg:'留学类型删除成功。'
		});
	});
};
exports.removeEduTypeItem = function(req,res,next){
	var itemId = validator.trim(req.body.sortId);
	Sort.removeEduTypeItem(itemId,function(err, removeResult){
		if(err)
			return next(err);

		return res.json({
			RemoveResult:true,
			SuccessMsg:'筛选分类删除成功。'
		});
	});
};
exports.removeEduTypeItemOption = function(req,res,next){
	var optionId = validator.trim(req.body.sortId);
	Sort.removeEduTypeItemOption(optionId,function(err, removeResult){
		if(err)
			return next(err);

		return res.json({
			RemoveResult:true,
			SuccessMsg:'分类选项删除成功。'
		});
	});
};
