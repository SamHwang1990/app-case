var models = require('../models');
var Sort = models.Sort;
var utility = require('utility');

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
 * @param {String} id EduType中文名
 * @param {Function} callback 回调函数
 */
exports.getEduTypeByName = function(name, callback){
	Sort.findOne({name:name, grade:0},{_id:1,name:1,slug:1},callback);
};

exports.newAndSaveEduType = function(name, slug, description, remark, callback){
	var eduType = new Sort();
	eduType.name = name;
	eduType.slug = slug;
	eduType.description = description;
	eduType.remark = remark;
	eduType.grade = 0;
	eduType.ancestors = null;
	eduType.parent_id = null;

	eduType.save(callback);
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
	var mapReduceObject = {};
	var eduTypeItemMap = function(){
		emit(this._id, {EduTypeItem:this, EduTypeItemOption:null});
	};
	var eduTypeItemQuery = {
		"parent_id":eduType_id,
		'grade':1
	};
	var eduTypeItemOptionMap = function(){
		emit(this.parent_id, {EduTypeItem:null, EduTypeItemOption:this});
	};
	var eduTypeDetailsReduce = function(k, vals){
		var result = {EduTypeItem:null, EduTypeItemOptions:[]};
		vals.forEach(function(value){
			if(result.EduTypeItem === null && value.EduTypeItem !== null){
				result.EduTypeItem = value.EduTypeItem;
			}

			if(value.EduTypeItemOption !== null){
				result.EduTypeItemOptions.push(value.EduTypeItemOption);
			}
		})
		return result;
	};

	mapReduceObject.map = eduTypeItemMap;
	mapReduceObject.reduce = eduTypeDetailsReduce;
	mapReduceObject.options = {
		out:{
			reduce:'reduce_SortEduTypeDetails'
		},
		query:eduTypeItemQuery
	};

	Sort.mapReduce(mapReduceObject,function(err, itemResults){
		var eduTypeItemOptionQuery = {
			"parent_id":itemResults[0]._id,
			'grade':2
		};
		mapReduceObject.map = eduTypeItemOptionMap;
		mapReduceObject.options.query = eduTypeItemOptionQuery;
		Sort.mapReduce(mapReduceObject,callback);
	})
};