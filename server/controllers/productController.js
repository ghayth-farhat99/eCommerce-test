const Product = require('../models/Product');

// Get product details
exports.getProduct = async (req, res) => {
  try {
    // For demo purposes, we'll just get the first product
    const product = await Product.findOne();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product inventory
exports.updateInventory = async (productId, quantity) => {
  try {
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }
    product.inventory -= quantity;
    await product.save();
  } catch (err) {
    throw err;
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};