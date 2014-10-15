var mongoose = require('mongoose');
var models = require('../models');
var Sort = models.Sort;
var Student = models.Student;

var utility = require('utility');
var _ = require('lodash');
var eventproxy = require('eventproxy');

/**
 * 根据分类ID，查找分类信息
 * Callback:
 * - err, 数据库异常
 * - sort, 分类
 * @param {String} id 分类ID
 * @param {Function} callback 回调函数
 */
exports.getSortById = function(id, callback){
	Sort.findOne({_id:id},callback);
};

/**
 * 根据EduType中文名，查找分类信息
 * Callback:
 * - err, 数据库异常
 * - sort, 分类
 * @param {String} name EduType中文名
 * @param {Function} callback 回调函数
 */
exports.getEduTypeByName = function(name, callback){
	Sort.findOne({name:name, grade:0},{_id:1,name:1,slug:1},callback);
};

/**
 * 根据EduType英文名，查找分类信息
 * Callback:
 * - err, 数据库异常
 * - sort, 分类
 * @param {String} slug EduType英文名
 * @param {Function} callback 回调函数
 */
exports.getEduTypeBySlug = function(slug,callback){
	Sort.findOne({slug:slug, grade:0},{},callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getSortsByQuery = function (query, opt, callback) {
	Sort.find(query, {}, opt, callback);
};

exports.newAndSaveEduType = function(name, slug, description, remark,importance, callback){
	var eduType = new Sort();
	eduType.name = name;
	eduType.slug = slug;
	eduType.description = description;
	eduType.remark = remark;
	eduType.grade = 0;
	eduType.importance = importance;
	eduType.ancestors = null;
	eduType.parent_id = null;

	eduType.save(callback);
};

exports.newAndSaveEduTypeItemOrOption = function(name, slug, grade, description, remark, parentId, callback){
	var newSort = new Sort();
	newSort.name = name;
	newSort.slug = slug;
	newSort.description = description;
	newSort.remark = remark;
	newSort.grade = grade;

	Sort.findOne({_id:parentId},function(err, parentSort){
		if(err)
			return callback(err, null);
		if(parentSort === null)
			return callback(null, null);

		newSort.ancestors = [];

		newSort.ancestors.push({
			_id:parentSort._id,
			name:parentSort.name,
			slug:parentSort.slug,
			description:parentSort.description,
			remark:parentSort.remark,
			grade:parentSort.grade});

		if(parentSort.ancestors !== null)
			newSort.ancestors = newSort.ancestors.concat(parentSort.ancestors);

		newSort.parent_id = parentId;
		newSort.save(callback);
	});
};

/**
 * 查找所有EduType列表
 * Callback:
 * - err, 数据库异常
 * - types, EduType
 * @param {Function} callback 回调函数
 */
exports.getEduTypes = function(callback){
	Sort.find({grade:0},callback);
};

/**
 * 根据EduType_id查找EduType_Item列表
 * Callback:
 * - err, 数据库异常
 * - items
 * @param {Array} eduType_id
 * @param {Function} callback 回调函数
 */
exports.getEduTypeItems = function(eduType_id,callback){
	Sort.find({parent_id:eduType_id, grade:1},callback);
};

/**
 * 根据EduType_Item_id查找EduType_Item_Option列表
 * Callback:
 * - err, 数据库异常
 * - options
 * @param {Array} item_id
 * @param {Function} callback 回调函数
 */
exports.getEduTypeItemOptions = function(item_id,callback){
	Sort.find({parent_id:item_id, grade:2}, callback);
};

exports.getEduTypeDetails = function(eduType_id,callback){
	var ep = new eventproxy();

	ep.fail(callback);
	ep.all('get_items','get_options',function(items,options){
		if(items === null || items.length <= 0)
			return callback(null,null);

		var details = [];

		_.forEach(items, function(item){
			var detailItem = {};
			detailItem.EduTypeItem = item;
			detailItem.EduTypeItemOptions = _.filter(options,function(option){
				return option.parent_id.toString() === item._id.toString();
			});
			details.unshift(detailItem);
		});

		callback(null, details);
	});

	Sort.find({parent_id:eduType_id,grade:1},ep.done('get_items'));
	Sort.find({'ancestors._id':mongoose.Types.ObjectId(eduType_id),grade:2},ep.done('get_options'));


};

exports.updateAncestor = function(newAncestor,callback){
	Sort.update({'ancestors._id':newAncestor._id},{$set:{'ancestors.$':newAncestor}},{ multi: true },callback);
};

var updateStudentSort = function(){
};

/* region Remove */
exports.removeEduTypeItemOption = function(optionId, callback){
	Sort.findOneAndRemove({_id:optionId, grade:2},function(err, option){
		if(err)
			return callback(err, null);
		updateStudentSort();
		callback(null, true);
	});
};
exports.removeEduTypeItem = function(itemId,callback){
	Sort.findOneAndRemove({_id:itemId, grade:1},function(err,item){
		if(err)
			return callback(err, null);

		var ep = new eventproxy();
		ep.fail(callback);
		ep.all('removeOptions',function(removeOptions){
			callback(null, removeOptions);
		});

		Sort.remove({parent_id:itemId, grade:2},function(err){
			if (err)
				// 一旦发生异常，一律交给error事件的handler处理
				return ep.emit('error', err);

			ep.emit('removeOptions',true);
		});

	});
};
exports.removeEduType = function(typeId, callback){
	Sort.findOneAndRemove({_id:typeId, grade:0},function(err, type){
		if(err)
			return callback(err,null);

		var ep = new eventproxy();
		ep.fail(callback);
		ep.all('removeDetails',function(removeDetails){
			callback(null, removeDetails);
		});

		Sort.remove({'ancestors._id':mongoose.Types.ObjectId(typeId)},function(err){
			if (err)
			// 一旦发生异常，一律交给error事件的handler处理
				return ep.emit('error', err);

			ep.emit('removeDetails',true);
		});
	});
};
/* endregion */