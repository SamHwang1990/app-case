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
    app.post('/signout', auth.signinRequired, sign.signout);    // 登出
    app.get('/signin', auth.signoutRequired, sign.showSignin);  //跳转到登录页面
    app.post('/signin',auth.signoutRequired,sign.signin);       //提交登录信息

    // region backend
	var backend_router = express.Router();
	app.use('/backend', backend_router);
	backend_router.use(auth.signinRequired);

	//backend index
	backend_router.route(['/','/index'])
		.get(backend.index);

	//backend user mgr
	backend_router.route(['/UserMgr','/UserMgr/List'])
		.get(backend.UserMgr.showList);
	backend_router.get('/UserMgr/ajaxList',backend.UserMgr.ajaxList);
	backend_router.route(['/UserMgr/Edit/:user_email'])
		.get(backend.UserMgr.showEdit)
		.post(backend.UserMgr.edit);
	backend_router.route(['/UserMgr/New'])
		.get(backend.UserMgr.showNew)
		.post(backend.UserMgr.new);
	backend_router.route(['/UserMgr/Delete/:user_email'])
		.get(backend.UserMgr.delete);

	//backend sort mgr
	backend_router.route(['/SortMgr','/SortMgr/List'])
		.get(backend.SortMgr.showList);
	backend_router.route(['/SortMgr/New'])
		.get(backend.SortMgr.showNew);
	backend_router.route(['/SortMgr/NewEduType'])
		.post(backend.SortMgr.newEduType);


	//endregion
};