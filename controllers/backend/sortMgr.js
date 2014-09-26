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
