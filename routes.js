/*
 * AppCase - routes.js
 * Copyright(c) 2014 samhwang1990@gmail.com
 * */

var site = require('./controllers/site');
var sign = require('./controllers/sign');
var config = require('./config');

module.exports = function(app){
    // home page Test
    app.get('/', site.index);

    //student list page
    app.get('/list',site.list);

    //student resume page
    app.get('/resume',site.resume);


    // sign up, login, logout
    app.get('/signup', sign.showSignup);  // 跳转到注册页面
    app.post('/signup', sign.signup);  // 提交注册信息
    app.post('/signout', sign.signout);  // 登出

}