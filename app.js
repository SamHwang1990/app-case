/**
 * Created by sam on 14-9-16.
 * AppCase - app.js
 */

/*
* Module dependencies
* */

var path = require('path');
var Loader = require('loader');
var express = require('express');
var session = require('express-session');
var flash = require('connect-flash');
var config = require('./config').config;
var passport = require('passport');
var LocalStrategy = require('passport-local');
//require('./models');
var routes = require('./routes');
//var auth = require('./middlewares/auth');
var MongoStore = require('connect-mongo')(session);
var _ = require('lodash');
var csurf = require('csurf');
var compress = require('compression');
var bodyParser = require('body-parser');
var busboy = require('connect-busboy');
var stylus = require('stylus');
var nib = require('nib');
var renderHelper = require('./common/render_helpers');

//静态文件目录
var staticDir = path.join(__dirname, 'public');

var assets = {};
if (config.mini_assets) {
    try {
        assets = require('./assets.json');
    } catch (e) {
        console.log('You must execute `make build` before start app when mini_assets is true.');
        throw e;
    }
}

var app = express();

//configuration in all env
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));
app.locals._layoutFile = 'layout.html';

app.use(require('response-time')());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	limit: '50mb',
    extended:true
}));
app.use(require('method-override')());
app.use(require('cookie-parser')(config.session_secret));
app.use(compress());
app.use(session({
    secret:config.session_secret,
    key:'sid',
    store:new MongoStore({
        db:config.db_name
    }),
    resave:true,
    saveUninitialized: true
}));
app.use(flash());

app.use(passport.initialize());

// custom middleware
app.use(require('./controllers/sign').auth_user);

app.use(stylus.middleware({
    src: __dirname,
    dest: __dirname + "/public",
    compile: function(str,path){
        console.log("Compile stylus file");
        return stylus(str)
            .set('filename', path)
            .set('compress', true)
            .use(nib())
            .import('nib');
    }
}));


app.use('/public',express.static(staticDir));

if (!config.debug) {
    app.use(csurf());
    app.set('view cache', true);
}

// set static, dynamic helpers
_.extend(app.locals, {
    config: config,
    Loader: Loader,
    assets: assets,
	CMTypes:[]
});

app.use(function (req, res, next) {
	renderHelper.getEduTypes(app);
    res.locals.csrf = req.csrfToken ? req.csrfToken() : '';
    next();
});

passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});
//passport.use(new LocalStrategy(localStrategyMiddleware));

app.use(busboy());

// routes
routes(app,express);

// error handler
app.use(function (err, req, res, next) {
    return res.status(500).send(err.message);
});

app.listen(config.port, function () {
    console.log("AppCase listening on port %d in %s mode", config.port, app.settings.env);
    console.log("God bless love....");
    console.log("You can debug your app with http://" + config.host + ':' + config.port);
});

module.exports = app;