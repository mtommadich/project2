var express = require('express');
var router = express.Router();
var Pdf = require ('../models/pdf')
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
  Pdf.find(function(err,docs){
    var rowsContent =[];
    var rowSize = 3;
    for (var i =0; i < docs.length; i+=rowSize){      
      rowsContent.push(docs.slice(i,i+rowSize));
    }
     res.render('shop/index', { title: 'Ebooks', documents: rowsContent });
    
  });
});

//Get user registration this also provides csrf token athentication
router.get('/user/register', function(req, res, next){
  res.render('user/register',{csrfToken: req.csrfToken()});
});

//register the user and redirect to homepage
router.post('/user/register', function(req, res, next){
  res.redirect('/');
});
module.exports = router;
