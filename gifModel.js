const mongoose = require('mongoose');

const gifSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  contentType: String,
  attributes: [String],
});

const GifModel = mongoose.model('Gif', gifSchema);

module.exports = GifModel;