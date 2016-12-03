/*this is a database seed data generator to put some initial data into our mongodb
You can access the database as follows:

1. open the terminal and run mongo
2.> use mean-dev
3.> db.pdfs.find()   - to find all entries in the pdfs collection

*/

//create Pdf model object
var Pdf = require('../models/pdf');
//import mongoose
var mongoose = require('mongoose');
//connect to the database
mongoose.connect('mongodb://localhost/mean-dev');

//create pdf array
var pdfs = [
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'Blender 2.7 Tutorial',
  category: '3D Modelling',
  description: 'Learn Blender modeling!'
  }),
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'Android 5 Programming',
  category: 'Android',
  description: 'Learn Android Programming!'
  }),
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'ANDROID_STUDIO_APPLICATION_DEVELOPMENT',
  category: '3D Modelling',
  description: 'Learn Android Programming!'
  }),
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'ASYNCHRONOUS_ANDROID',
  category: '3D Modelling',
  description: 'Learn Android Programming!'
  }),
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'BURP_SUITE_ESSENTIALS',
  category: 'Web Development',
  description: 'Learn burp suite!'
  }),
  new Pdf({
  iconPath:'<i class="fa fa-file-pdf-o" aria-hidden="true"></i>',
  title:'INSTANT_NODEJS_STARTER',
  category: 'Web Development',
  description: 'Learn about nodejs!'
  })  
];

//iterate over the pdf array and insert pdf objects one by one. 
//Then check if array end is reached. If yes, call exit() which will disconnent us from mongodb.
var done = 0;
for (var i = 0; i < pdfs.length; i++){
  pdfs[i].save(function(err,result){
    done++;
    if (done === pdfs.length){
      exit();
    }
  })
}
function exit(){
  mongoose.disconnect();
}