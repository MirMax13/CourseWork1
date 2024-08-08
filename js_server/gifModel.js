const mongoose = require('mongoose');

const gifSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toString(),
  },
  filename: String,
  data: Buffer,
  contentType: String,
  attributes: [String],
});

gifSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  }
});

const GifModel = mongoose.model('Gif', gifSchema);

module.exports = GifModel;