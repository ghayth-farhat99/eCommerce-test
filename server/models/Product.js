const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  variants: {
    type: [String],
    required: true
  },
  inventory: {
    type: Number,
    required: true,
    default: 100
  }
});

module.exports = mongoose.model('Product', productSchema);