/*
 * AppCase - routes.js
 * Copyright(c) 2014 samhwang1990@gmail.com
 * */

var site = require('./controllers/site');
var sign = require('./controllers/sign');
var backend = require('./controllers/backend');
var config = require('./config');
var auth = require('./middlewares/auth');

module.exports = function(app,express){

    // home page Test
    app.get('/', site.index);

    //student list page
    app.get('/list',site.list);

    //student resume page
    app.get('/resume',site.resume);


    // sign up, login, logout
    app.get('/signup', auth.signoutRequired, sign.showSignup);  // 跳转到注册页面
    app.post('/signup', auth.signoutRequired, sign.signup);     // 提交注册信息
    app.post('/signout', auth.signinRequired, sign.signout);                         // 登出
    app.get('/signin', auth.signoutRequired, sign.showSignin);  //跳转到登录页面
    app.post('/signin',auth.signoutRequired,sign.signin);       //提交登录信息

    // backend
	var backend_router = express.Router();
	backend_router.use(auth.signinRequired);

	//backend index
	backend_router.route(['/','/index'])
		.get(backend.index);

    app.use('/backend', backend_router);
}