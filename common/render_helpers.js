/**
 * Created by sam on 14-10-15.
 */

var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var config = require('../config').config;
var Sort = require('../proxy').Sort;

exports.getEduTypes = function(app){
	Sort.getEduTypes(function(err,types){
		if(err)
			return next(err);
		app.locals.CMTypes = types
	});
}
