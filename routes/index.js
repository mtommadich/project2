var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Pdf = require('../models/pdf');
var csrfProtection = csrf();


router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Pdf.find(function(err, docs) {
    var rowsContent = [];
    var rowSize = 3;
    for (var i = 0; i < docs.length; i += rowSize) {
      rowsContent.push(docs.slice(i, i + rowSize));
    }
    res.render('shop/index', {
      title: 'Ebooks',
      documents: rowsContent
    });

  });
});

//Get user registration this also provides csrf token athentication
router.get('/user/register', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/register', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

//register the user and redirect to profile on success or retry on failure
router.post('/user/register', passport.authenticate('local.registration', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/register',
  failureFlash: true
}));

//get user profile page
router.get('/user/profile', function(req, res, next) {
  res.render('user/profile');
});

//get user login route
router.get('/user/login', function(req, res, next) {
  var messages = req.flash('error');
  res.render('user/login', {
    csrfToken: req.csrfToken(),
    messages: messages,
    hasErrors: messages.length > 0
  });
});

//get the user login route
router.post('/user/login', passport.authenticate('local.login', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/login',
  failureFlash: true
}));


module.exports = router;