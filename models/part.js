const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PartSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    minLength: 3,
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
})

PartSchema.virtual('url').get(function () {
  return `/catalog/part/${this._id}`;
})

module.exports = mongoose.model('Part', PartSchema);