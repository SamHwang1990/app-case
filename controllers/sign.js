/**
 * AppCase - sign controller.
 * Created by sam on 14-9-23.
 */
var validator = require('validator');
var sanitizer = require('sanitizer');
var eventproxy = require('eventproxy');

var crypto = require('crypto');
var config = require('../config').config;

var User = require('../proxy').User;

//sign up
exports.showSignup = function (req, res) {
    res.render('sign/signup',{
        topic: {
            title: '用户注册 - ' + config.description
        }
    });
};

exports.signup = function(req,res,next){
    var name = validator.trim(req.body.name);
    name = sanitizer.sanitize(name);
    var name_en = validator.trim(req.body.name_en);
    name_en = sanitizer.sanitize(name_en);
    var email = validator.trim(req.body.email);
    email = email.toLowerCase();
    var pass = validator.trim(req.body.pass);
    pass = sanitizer.sanitize(pass);
    email = sanitizer.sanitize(email);
    var pass_repeat = validator.trim(req.body.pass_repeat);
    pass_repeat = sanitizer.sanitize(pass_repeat);

    if (name === '' || name_en === '' || pass === '' || pass_repeat === '' || email === '') {
        req.flash('error','信息不完整。');
        res.render('sign/signup', {error: req.flash('error').toString(),name: name, email: email, name_en:name_en});
        return;
    }

    if(!validator.isEmail(email)){
        req.flash('error','不正确的电子邮箱。');
        res.render('sign/signup', {error: req.flash('error').toString(), name: name, email: email, name_en:name_en});
        return;
    }

    if (name.length < 1) {
        req.flash('error','用户名至少需要1个字符。');
        res.render('sign/signup', {error: req.flash('error').toString(), name: name, email: email, name_en:name_en});
        return;
    }

    if (name_en.length < 1) {
        req.flash('error','用户英文名至少需要1个字符。');
        res.render('sign/signup', {error: req.flash('error').toString(), name: name, email: email, name_en:name_en});
        return;
    }

    if(!validator.isAlphanumeric(name_en)){
        req.flash('error','用户英文名只能使用0-9，a-z，A-Z。');
        res.render('sign/signup', {error: req.flash('error').toString(), name: name, email: email, name_en:name_en});
        return;
    }

    if (pass !== pass_repeat) {
        req.flash('error','两次密码输入不一致。');
        res.render('sign/signup', {error: req.flash('error').toString(), name: name, email: email, name_en:name_en});
        return;
    }

    User.getUserByMail(email,function(err,user){
        if(err)
            return next(err);

        if(user !== null){
            req.flash('error','邮箱名已被占用。');
            res.render('sign/signup',{error: req.flash('error').toString(), name:name, email:email, name_en:name_en});
            return;
        }

        // md5 the pass
        pass = md5(pass);
        //create gravatar
        var avatar_url = User.makeGravatar(email);

        User.newAndSave(name,name_en,pass,email,avatar_url,true,function(err, user){
            if (err) {
                return next(err);
            }

            // store session cookie
            gen_session(user, res, false);
            req.flash('success','欢迎加入 ' + config.name);
            res.render('index',{success:req.flash('success')});
        });
    });

};

//sign out
exports.signout = function(req,res,next){
    req.session.destroy();
    res.clearCookie(config.auth_cookie_name, { path: '/' });
    res.redirect(req.headers.referer || '/');
};

//sign in
exports.showSignin = function(req,res,next){
    req.session._loginReferer = req.headers.referer;
    res.render('sign/signin',{
        topic:{
            title:'用户登录 - ' + config.description
        }
    });
};


/**
 * define some page when login just jump to the home page
 * @type {Array}
 */
var notJump = [
    '/signup',         //regist page
];

exports.signin = function(req,res,next){
    var email = validator.trim(req.body.email);
    email = email.toLowerCase();
    email = sanitizer.sanitize(email);

    var pass = validator.trim(req.body.pass);
    pass = sanitizer.sanitize(pass);

    var rememberme = validator.trim(req.body.rememberme);
	rememberme = rememberme === 'on'?true:false;

    if(email == '' || pass == ''){
        req.flash('error','信息不完整。');
        res.render('sign/signin',{error:req.flash('error').toString(), email:email});
        return;
    }

    if(!validator.isEmail(email)){
        req.flash('error','不正确的邮箱地址。');
        res.render('sign/signin',{error:req.flash('error').toString(), email:email});
        return;
    }

    User.getUserByMail(email,function(err,user){
        if(err){
            return next(err);
        }
        if(!user){
            req.flash('error','用户不存在。');
            res.render('sign/signin',{error:req.flash('error').toString(), email:email});
            return;
        }

        pass = md5(pass);
        if(pass !== user.pass){
            req.flash('error','密码错误。');
            res.render('sign/signin',{error:req.flash('error').toString(), email:email});
            return;
        }
        //store session cookie
        gen_session(user,res,rememberme);
        //check at some page just jump to home page
        var refer = req.session._loginReferer || '/';
        for (var i = 0, len = notJump.length; i !== len; ++i) {
            if (refer.indexOf(notJump[i]) >= 0) {
                refer = '/';
                break;
            }
        }
        res.redirect(refer);
    });
};

exports.auth_user = function(req,res,next){
    var ep = new eventproxy();
    ep.fail(next);

    ep.all('get_user',function(user){
        if(!user){
            return next();
        }
        res.locals.current_user = req.session.user = user;
        req.session.user.avatar = User.getGravatar(user);
        next();
    });

    if(req.session.user){
        ep.emit('get_user',req.session.user);
    }else{
        var cookie = req.cookies[config.auth_cookie_name];
        if (!cookie) {
            return next();
        }
        var auth_token = decrypt(cookie,config.session_secret);
        var auth = auth_token.split('\t');
        var user_id = auth[0];
        User.getUserById(user_id,ep.done('get_user'));
    }

};

// private
function gen_session(user, res, rememberme) {
    var auth_token = encrypt(user._id + '\t' + user.name + '\t' + user.pass + '\t' + user.email, config.session_secret);
	if(rememberme)
		res.cookie(config.auth_cookie_name,auth_token, {path: '/', maxAge: 1000 * 60 * 60 * 24 * 30}); //cookie 有效期30天
	else
		res.cookie(config.auth_cookie_name,auth_token, {path: '/'}); //generate a session cookie, which will delete when browser closed
}

exports.gen_session = gen_session;

function encrypt(str, secret) {
    var cipher = crypto.createCipher('aes192', secret);
    var enc = cipher.update(str, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
}

function decrypt(str, secret) {
    var decipher = crypto.createDecipher('aes192', secret);
    var dec = decipher.update(str, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function md5(str){
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    str = md5sum.digest('hex');
    return str;
}