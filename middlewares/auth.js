/**
 * Created by sam on 14-9-24.
 */

/**
 * 需要登录，响应错误页面
 */
exports.signinRequired = function (req, res, next) {
    if (!req.session.user) {
        res.render('notify/notify', {error: '未登入用户不能发布话题。'});
        return;
    }
    next();
};

exports.signoutRequired = function(req,res,next){
    if(!req.session.user){
        return next();
    }
    res.render('notify/notify', {error: '您已登录。'});
}
