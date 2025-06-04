const Order = require('../models/Order');
const Product = require('../models/Product');
const productController = require('./productController');

module.exports = (transporter) => {
  // Generate a unique order number
  const generateOrderNumber = () => {
    return 'ORD-' + Date.now().toString().slice(-8) + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  };

  // Send confirmation email
  const sendConfirmationEmail = async (order) => {
    let subject, text;
    
    if (order.status === 'approved') {
      subject = `Your Order #${order.orderNumber} Confirmation`;
      text = `Thank you for your order!\n\nOrder #${order.orderNumber}\nProduct: ${order.product.name}\nTotal: $${(order.product.price * order.product.quantity).toFixed(2)}`;
    } else if (order.status === 'declined') {
      subject = `Order #${order.orderNumber} Declined`;
      text = `Your order #${order.orderNumber} was declined. Please check your payment details.`;
    } else {
      subject = `Payment Error for Order #${order.orderNumber}`;
      text = `We encountered an error processing your payment for order #${order.orderNumber}.`;
    }
    
    try {
      await transporter.sendMail({
        from: '"eCommerce Store" <no-reply@example.com>',
        to: order.customer.email,
        subject,
        text
      });
      console.log('Email sent successfully');
    } catch (err) {
      console.error('Email sending error:', err);
    }
  };

  return {
    createOrder: async (req, res) => {
      try {
        const { product, customer, payment, transactionType } = req.body;
        
        // Validate transaction type
        if (![1, 2, 3].includes(transactionType)) {
          return res.status(400).json({ message: 'Invalid transaction type' });
        }
        
        const status = ['approved', 'declined', 'failed'][transactionType - 1];
        const order = new Order({
          orderNumber: generateOrderNumber(),
          product,
          customer,
          payment,
          status
        });
        
        const savedOrder = await order.save();
        console.log('Order saved:', savedOrder.orderNumber);
        
        if (status === 'approved') {
          await productController.updateInventory(product.id, product.quantity);
        }
        
        await sendConfirmationEmail(savedOrder);
        
        res.status(201).json(savedOrder);
      } catch (err) {
        console.error('Order creation error:', err);
        res.status(400).json({ message: err.message });
      }
    },
    
    getOrder: async (req, res) => {
      try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });
        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  };
};