var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Pdf = require('../models/pdf');
//var csrfProtection = csrf();
//router.use(csrfProtection);

//create Pdf model object
var Pdf = require('../models/pdf');
//import mongoose
var mongoose = require('mongoose');

router.get('/addbook', isLoggedIn,function(req, res, next) {
  var messages = req.flash('error');
  res.render('books/addbook');
});

router.get('books/addbook', isLoggedIn,function(req, res, next) {
  var messages = req.flash('error');
  res.render('books/addbook');
});

router.post('/addbook', isLoggedIn,function(req, res) { 
  var newPdf = new Pdf ();
    newPdf.iconPath = '<i class="fa fa-file-pdf-o" aria-hidden="true"></i>';
    newPdf.title = req.body.title;
    newPdf.category = "development";
    newPdf.description = req.body.description;  
    newPdf.link = req.body.link; 
    newPdf.save();    
    res.render('user/books');
  console.log("posted something");
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('books/index', {
  title: 'Contacts'
  });
});



module.exports = router;

function isLoggedIn(req,res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/books');
}