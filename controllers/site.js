/*
* AppCase - site index controller.
* Copyright(c) 2014 samhwang1990@gmail.com
* */

var config = require('../config').config;

exports.index = function(req,res,next){
    res.render('index',{
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