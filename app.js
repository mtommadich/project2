var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expHbs = require('express-handlebars');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var validation = require('express-validator');
var routes = require('./routes/index');
var userRoutes = require('./routes/user');

var app = express();
mongoose.connect('mongodb://localhost/mean-dev');
require('./_config/passport');

// view engine setup
app.engine('.hbs', expHbs({
  defaultLayout: 'layout',
  extname: '.hbs'
}));
app.set('view engine', '.hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(validation());
app.use(cookieParser());

//configuring mongoose db connection properties here. We already have an open
//connection to mongoDB, since we're loading the ebooks from the db.
//Mario - DONT FORGET TO ADD THE readme for the database seeder... 

app.use(session({
  secret: 'myPassword',
  resave: false, //safety precaution
  saveUninitialized: false //safety precaution
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next) {
//res.locals.x creates a global variable x which can be seen from everywhere.
//we use this technique to be able to determine if a user is logged in or not
//and also to be able to restore their session if it hasn't yet expired.
res.locals.login = req.isAuthenticated();
  next();
})

app.use('/user', userRoutes);
app.use('/', routes);

//Contact list related stuff below. Whoohoo!
app.get('/contactlist', function (req, res) {
  db.contactlist.find(function (err, docs) {
    console.log(docs);
      res.json(docs);
  });
});

app.post('/contactlist', function (req, res) {
  console.log(req.body);
  db.contactlist.insert(req.body, function(err, doc) {
    res.json(doc);
  });
});

app.delete('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.remove({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.get('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(id);
  db.contactlist.findOne({_id: mongojs.ObjectId(id)}, function (err, doc) {
    res.json(doc);
  });
});

app.put('/contactlist/:id', function (req, res) {
  var id = req.params.id;
  console.log(req.body.name);
  db.contactlist.findAndModify({
    query: {_id: mongojs.ObjectId(id)},
    update: {$set: {name: req.body.name, email: req.body.email, number: req.body.number}},
    new: true}, function (err, doc) {
      res.json(doc);
    }
  );
});

////////////////////////////////////
//Todo: write get, post delete, put
//for the ebook listing as well... 
//...if there is any time left.
/////////////////////////////////////
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

// render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

//////////////// Done already?!? Wait a minute - this wasn't fun at all!! :_( I want my money back ////////////