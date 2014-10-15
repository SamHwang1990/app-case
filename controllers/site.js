/*
* AppCase - site index controller.
* Copyright(c) 2014 samhwang1990@gmail.com
* */
var eventproxy = require('eventproxy');
var util = require('utility');
var _ = require('lodash');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

var config = require('../config').config;
var Student = require('../proxy').Student;
var Sort = require('../proxy').Sort;

exports.index = function(req,res,next){
    res.render('frontend/index',{
	    success:req.flash('success'),
        topic:{
            title:config.description
        }
    });
};

exports.list = function(req,res,next){
    res.render('list',{
        topic:{
            title:'student list'
        }
    });
};

exports.resume = function(req,res,next){
    res.render('resume',{
        topic:{
            title:'student resume'
        }
    });
};