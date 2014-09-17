/*
* AppCase - site index controller.
* Copyright(c) 2014 samhwang1990@gmail.com
* */

var config = require('../config').config;

exports.index = function(req,res,next){
    res.render('index',{
        topic:{
            title:config.description
        }
    });
};