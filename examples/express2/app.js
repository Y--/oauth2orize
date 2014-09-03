/**
 * Module dependencies.
 */
var express = require('express')
  , passport = require('passport')
  , site = require('./site')
  , oauth2 = require('./oauth2')
  , user = require('./user')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , logger = require('morgan')
  , errorHandler = require('errorhandler');


// Express configuration

var app = express();

app.set('view engine', 'ejs');
app.use(logger(':date :method :url :status :res[content-length] :response-time ms'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended : true, limit : '1mb' }));
app.use(bodyParser.json({ limit : '1mb' }));
app.use(session({ resave : true, saveUninitialized : false, secret : 'keyboard cat' }));
/*
app.use(function(req, res, next) {
  console.log('-- session --');
  console.dir(req.session);
  //console.log(util.inspect(req.session, true, 3));
  console.log('-------------');
  next()
});
*/
app.use(passport.initialize());
app.use(passport.session());
app.use(errorHandler({ dumpExceptions: true, showStack: true }));

// Passport configuration
require('./auth');


app.get('/', site.index);
app.get('/login', site.loginForm);
app.post('/login', site.login);
app.get('/logout', site.logout);
app.get('/account', site.account);

app.get('/dialog/authorize', oauth2.authorization);
app.post('/dialog/authorize/decision', oauth2.decision);
app.post('/oauth/token', oauth2.token);

app.get('/api/userinfo', user.info);

app.listen(3000);
