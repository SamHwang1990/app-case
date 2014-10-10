/**
 * Created by sam on 14-9-24.
 * backend controller index
 */

var config = require('../../config').config;

exports.index = function(req,res,next){
	return res.render('backend/index',{
		isBack:true,
		topic:{
			title:"首页 - 后台管理 - " + config.description
		}
	})
};

exports.UserMgr = require('./userMgr');
exports.SortMgr = require('./sortMgr');
exports.StudentMgr = require('./studentMgr');
