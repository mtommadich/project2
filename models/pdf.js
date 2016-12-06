var path = require('path');
var mongoose = require('mongoose');
var filePluginLib = require('mongoose-file');
var filePlugin = filePluginLib.filePlugin;
var make_upload_to_model = filePluginLib.make_upload_to_model;
var Schema = mongoose.Schema;

var pdfSchema = new Schema({
  iconPath:{type: String, required: true},
  title:{type: String, required: true},
  category:{type: String, required: true},
  description:{type: String, required:true},
  link:{type: String, required: true}
});



module.exports = mongoose.model('pdf', pdfSchema);