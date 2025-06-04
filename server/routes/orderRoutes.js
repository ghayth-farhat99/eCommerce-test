const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

module.exports = (transporter) => {
  // Inject transporter into controller
  const controller = orderController(transporter);
  
  router.post('/', controller.createOrder);
  router.get('/:orderNumber', controller.getOrder);
  
  return router;
};