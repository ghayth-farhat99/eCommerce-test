import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ThankYouPage = () => {
  const { orderNumber } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URI}/api/orders/${orderNumber}`);
        setOrder(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderNumber]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="thank-you-page">
      {order.status === 'approved' ? (
        <>
          <h1>Thank You for Your Order!</h1>
          <p>Your order has been placed successfully.</p>
        </>
      ) : order.status === 'declined' ? (
        <>
          <h1>Payment Declined</h1>
          <p>We're sorry, but your payment was declined.</p>
        </>
      ) : (
        <>
          <h1>Payment Error</h1>
          <p>We encountered an error processing your payment.</p>
        </>
      )}
      
      <div className="order-details">
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> {order.orderNumber}</p>
        <p><strong>Status:</strong> {order.status.toUpperCase()}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
      </div>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        <div className="summary-item">
          <span>Product:</span>
          <span>{order.product.name} ({order.product.variant})</span>
        </div>
        <div className="summary-item">
          <span>Quantity:</span>
          <span>{order.product.quantity}</span>
        </div>
        <div className="summary-item">
          <span>Price per item:</span>
          <span>${order.product.price.toFixed(2)}</span>
        </div>
        <div className="summary-item total">
          <span>Total:</span>
          <span>${(order.product.price * order.product.quantity).toFixed(2)}</span>
        </div>
      </div>
      
      <div className="customer-info">
        <h2>Customer Information</h2>
        <p><strong>Name:</strong> {order.customer.fullName}</p>
        <p><strong>Email:</strong> {order.customer.email}</p>
        <p><strong>Phone:</strong> {order.customer.phone}</p>
        <p><strong>Address:</strong> {order.customer.address}, {order.customer.city}, {order.customer.state} {order.customer.zipCode}</p>
      </div>
      
      {order.status === 'approved' ? (
        <p>An order confirmation has been sent to your email.</p>
      ) : (
        <p>Please check your payment information and try again, or contact support.</p>
      )}
    </div>
  );
};

export default ThankYouPage;