var express = require('express');
var router = express.Router();
var Pdf = require ('../models/pdf')

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

module.exports = router;
