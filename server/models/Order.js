const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  product: {
    name: String,
    variant: String,
    quantity: Number,
    price: Number
  },
  customer: {
    fullName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    state: String,
    zipCode: String
  },
  payment: {
    cardNumber: String,
    expiryDate: String,
    cvv: String
  },
  status: {
    type: String,
    enum: ['approved', 'declined', 'failed'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);