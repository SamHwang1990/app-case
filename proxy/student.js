/**
 * Created by sam on 14-10-10.
 */
var models = require('../models');
var Student = models.Student;
var utility = require('utility');

/**
 * 根据学生名列表查找学生
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getStudentsByName = function (names, callback) {
	if (names.length === 0) {
		return callback(null, []);
	}
	Student.find({ name: { $in: names } }, callback);
};

/**
 * 根据中文名查找学生
 * Callback:
 * - err, 数据库异常
 * - student, 学生
 * @param {String} name 中文名
 * @param {Function} callback 回调函数
 */
exports.getStudentByName = function (name, callback) {
	Student.findOne({'name': name}, callback);
};

/**
 * 根据学生ID，查找学生
 * Callback:
 * - err, 数据库异常
 * - student, 学生
 * @param {String} id 学生ID
 * @param {Function} callback 回调函数
 */
exports.getStudentById = function (id, callback) {
	Student.findOne({_id: id}, callback);
};

/**
 * 根据英文名，查找学生
 * Callback:
 * - err, 数据库异常
 * - student, 学生
 * @param {String} nameEn 学生名
 * @param {Function} callback 回调函数
 */
exports.getStudentByNameEn = function (nameEn, callback) {
	Student.findOne({name_en: nameEn}, callback);
};

/**
 * 根据邮箱，查找学生
 * Callback:
 * - err, 数据库异常
 * - student, 学生
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getStudentByMail = function (email, callback) {
	Student.findOne({email: email}, callback);
};

/**
 * 根据关键字，获取一组学生
 * Callback:
 * - err, 数据库异常
 * - students, 学生列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getStudentsByQuery = function (query, opt, callback) {
	Student.find(query, {}, opt, callback);
};
