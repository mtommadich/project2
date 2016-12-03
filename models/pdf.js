var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pdfSchema = new Schema({
  iconPath:{type: String, required: true},
  title:{type: String, required: true},
  category:{type: String, required: true},
  description:{type: String, required:true}
});
module.exports = mongoose.model('pdf', pdfSchema);