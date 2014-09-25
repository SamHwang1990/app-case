var models = require('../models');
var User = models.User;
var utility = require('utility');

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
    if (names.length === 0) {
        return callback(null, []);
    }
    User.find({ name: { $in: names } }, callback);
};

/**
 * 根据中文名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 中文名
 * @param {Function} callback 回调函数
 */
exports.getUserByName = function (name, callback) {
    User.findOne({'name': name}, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    User.findOne({_id: id}, callback);
};

/**
 * 根据用户名，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {Function} callback 回调函数
 */
exports.getUserByNameEn = function (nameEn, callback) {
    User.findOne({name_en: nameEn}, callback);
};

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({email: email}, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
    User.find({'_id': {'$in': ids}}, callback);
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
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, {}, opt, callback);
};

exports.newAndSave = function (name, name_en, pass, email, avatar_url, active, create_date, last_login_date, callback) {
    var user = new User();
    user.name = name;
    user.name_en = name_en;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = true;
    user.create_date = Date();
	user.last_login_date = null;
    user.save(callback);
};

var makeGravatar = function (email) {
    return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48&d=identicon';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
    return user.avatar || makeGravatar(user.email);
};
