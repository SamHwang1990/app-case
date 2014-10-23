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

    // home page
    app.get('/', site.index);
	app.get('/EduType/:typeId', site.showEduType);
	app.get('/EduType/ItemOptions/:typeId/:itemId', site.showEduTypeItemOptions);
	app.get('/EduType/Option/StudentList/:typeId/:optionId/:page?',site.showOptionStudentList);

	app.get('/StudentInfo/CaseResume/:studentId',site.showStudentResume);
	app.get('/StudentInfo/EssayList/:studentId',site.showStudentEssayList);

    //student list page
    app.get('/list',site.list);

    //student resume page
    app.get('/resume',site.resume);


    //region sign up, login, logout
    app.get('/signup', auth.signoutRequired, sign.showSignup);  // 跳转到注册页面
    app.post('/signup', auth.signoutRequired, sign.signup);     // 提交注册信息
    app.post('/signout', auth.signinRequired, sign.signout);    // 登出
    app.get('/signin', auth.signoutRequired, sign.showSignin);  //跳转到登录页面
    app.post('/signin',auth.signoutRequired,sign.signin);       //提交登录信息
	//endregion

	var backend_router = express.Router();
	app.use('/backend', backend_router);
	backend_router.use(auth.signinRequired);

	//backend index
	backend_router.route(['/','/index'])
		.get(backend.index);

	//region backend user mgr
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

	//endregion

	//region backend sort mgr
	backend_router.route(['/SortMgr','/SortMgr/List'])
		.get(backend.SortMgr.showList);
	backend_router.route(['/SortMgr/New'])
		.get(backend.SortMgr.showNew);
	backend_router.route(['/SortMgr/EduTypeDetails/:typeId'])
		.get(backend.SortMgr.showEduTypeDetails);
	backend_router.route(['/SortMgr/Edit/:typeId'])
		.get(backend.SortMgr.showEditEduType);
	backend_router.route(['/SortMgr/EditDetails/:typeId'])
		.get(backend.SortMgr.showEditEduTypeDetails);


	backend_router.route(['/SortMgr/NewEduType'])
		.post(backend.SortMgr.newEduType);
	backend_router.route(['/SortMgr/NewEduTypeItemOrOption'])
		.post(backend.SortMgr.newEduTypeItemOrOption);

	backend_router.route(['/SortMgr/EditEduType'])
		.post(backend.SortMgr.editEduType);
	backend_router.route(['/SortMgr/EditEduTypeItemOrOption'])
		.post(backend.SortMgr.editEduTypeItemOrOption);

	backend_router.route(['/SortMgr/removeEduTypeItemOption'])
		.post(backend.SortMgr.removeEduTypeItemOption);
	backend_router.route(['/SortMgr/removeEduTypeItem'])
		.post(backend.SortMgr.removeEduTypeItem);
	backend_router.route(['/SortMgr/removeEduType'])
		.post(backend.SortMgr.removeEduType);

	//endregion

	//region backend student mgr

	backend_router.route(['/StudentMgr','/StudentMgr/List'])
		.get(backend.StudentMgr.showStudentList);
	backend_router.get('/StudentMgr/ajaxList',backend.StudentMgr.ajaxStudentList);

	backend_router.route(['/StudentMgr/New'])
		.get(backend.StudentMgr.showNew)
		.post(backend.StudentMgr.newStudent);

	backend_router.route(['/StudentMgr/Edit/:studentId'])
		.get(backend.StudentMgr.showEdit)
		.post(backend.StudentMgr.editStudent);

	backend_router.route(['/StudentMgr/Delete/:studentId'])
		.get(backend.StudentMgr.delete);

	backend_router.route(['/StudentMgr/EditSort/:studentId'])
		.get(backend.StudentMgr.showEditSort)
		.post(backend.StudentMgr.editStudentSort);
	backend_router.route(['/StudentMgr/GetSortContent/:studentId'])
		.get(backend.StudentMgr.ajaxStudentSort);
	backend_router.route(['/StudentMgr/EditResume/:studentId'])
		.get(backend.StudentMgr.showEditResume)
		.post(backend.StudentMgr.editStudentResume);

	backend_router.route(['/StudentMgr/EssayList/:studentId'])
		.get(backend.StudentMgr.showEssayList);

	backend_router.route(['/StudentMgr/NewEssayItem/:studentId'])
		.get(backend.StudentMgr.showNewEssayItem)
		.post(backend.StudentMgr.newEssayItem);

	backend_router.route(['/StudentMgr/EditEssayItem/:studentId/:essayId'])
		.get(backend.StudentMgr.showEditEssayItem)
		.post(backend.StudentMgr.editEssayItem);

	backend_router.route(['/StudentMgr/DeleteEssayItem/:studentId/:essayId'])
		.get(backend.StudentMgr.deleteEssayItem);



	//endregion
};