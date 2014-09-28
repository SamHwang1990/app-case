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
	Sort.findOne({name:name, grade:0},callback);
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