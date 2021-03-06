var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Pdf = require('../models/pdf');
var csrfProtection = csrf();
var mongojs = require('mongojs');
var db = mongojs('contactlist', ['contactlist']);
router.use(csrfProtection);
var app = express();
var bodyParser = require('body-parser');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

//get user profile page - accessible if user is logged in only
router.get('/profile', isLoggedIn,function(req, res, next) {
  res.render('user/profile');
});

router.get('/books', function(req, res, next) {  
  Pdf.find(function(err, docs) {
    var rowsContent = [];
    var rowSize = 3;
    for (var i = 0; i < docs.length; i += rowSize) {
      rowsContent.push(docs.slice(i, i + rowSize));
    }
    res.render('user/books', {
      title: 'Ebooks',
      documents: rowsContent
    });
  });
});
//get boomboom pageXOffset

router.get('/boomboom', function(req,res,next){
  res.render('user/boomboom');
})
//get log out page
router.get('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
});


//////////////////////////////////////////////////////////////////////
//All routes below here are the ones which are accessible to all users,
//which are not logged in
router.use('/', notLoggedIn, function(req, res, next){
  next();
})

//Get user registration - this also provides csrf token athentication
router.get('/register', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/register', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

//register the user and redirect to profile on success or retry on failure
router.post('/register', passport.authenticate('local.registration', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
}));

//get user login route
router.get('/login', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

//get the user login route
router.post('/login', passport.authenticate('local.login', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));

module.exports = router;

function isLoggedIn(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/books');
}

function notLoggedIn(req,res, next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

