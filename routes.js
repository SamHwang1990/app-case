/*
 * AppCase - routes.js
 * Copyright(c) 2014 samhwang1990@gmail.com
 * */

var site = require('./controllers/site');
var config = require('./config');

module.exports = function(app){
    // home page
    app.get('/', site.index);
}