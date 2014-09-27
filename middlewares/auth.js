/**
 * Created by sam on 14-9-24.
 */

/**
 * 需要登录，响应错误页面
 */
exports.signinRequired = function (req, res, next) {
    if (!req.session.user) {
        req.flash('error','使用该功能需要登录系统。');
        res.render('notify/notify', {error: req.flash('error')});
        return;
    }
    next();
};

exports.signoutRequired = function(req,res,next){
    if(!req.session.user){
        return next();
    }
    req.flash('error','使用该功能需要登出系统。');
    res.render('notify/notify', {error:req.flash('error')});
};
