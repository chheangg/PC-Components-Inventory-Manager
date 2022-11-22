const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    min: 3,
    required: true,
  }
})

// Virtual for URL
CategorySchema.virtual('url').get(function () {
  return `/catalog/category/${this._id}`
})

module.exports = mongoose.model('Category', CategorySchema)