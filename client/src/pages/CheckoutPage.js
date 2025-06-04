import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(location.state?.product);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    transactionType: 1 // Default to approved
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!product) {
      navigate('/');
    }
  }, [product, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Basic validation
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.phone.match(/^\d{10,15}$/)) newErrors.phone = 'Invalid phone number';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.match(/^\d{5}(-\d{4})?$/)) newErrors.zipCode = 'Invalid ZIP code';
    if (!formData.cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = 'Invalid card number';
    
    const today = new Date();
    const [month, year] = formData.expiryDate.split('/');
    const expiryDate = new Date(`20${year}`, month - 1);
    if (!formData.expiryDate.match(/^(0[1-9]|1[0-2])\/\d{2}$/) || expiryDate < today) {
      newErrors.expiryDate = 'Invalid expiry date';
    }
    
    if (!formData.cvv.match(/^\d{3}$/)) newErrors.cvv = 'Invalid CVV';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const orderData = {
        product: {
          id: product._id,
          name: product.name,
          variant: product.variant,
          quantity: product.quantity,
          price: product.price
        },
        customer: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        payment: {
          cardNumber: formData.cardNumber,
          expiryDate: formData.expiryDate,
          cvv: formData.cvv
        },
        transactionType: parseInt(formData.transactionType)
      };
      
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URI}/api/orders`, orderData);
      navigate(`/thank-you/${response.data.orderNumber}`);
    } catch (err) {
      console.error('Order submission failed:', err);
      alert('Order submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      
      <div className="checkout-container">
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2>Customer Information</h2>
          
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}
          </div>
          
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
            {errors.phone && <span className="error">{errors.phone}</span>}
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && <span className="error">{errors.address}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <span className="error">{errors.city}</span>}
            </div>
            
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
              {errors.state && <span className="error">{errors.state}</span>}
            </div>
            
            <div className="form-group">
              <label>ZIP Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
              {errors.zipCode && <span className="error">{errors.zipCode}</span>}
            </div>
          </div>
          
          <h2>Payment Information</h2>
          
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleChange}
              placeholder="1234123412341234"
              required
            />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Expiry Date</label>
              <input
                type="text"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                placeholder="MM/YY"
                required
              />
              {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
            </div>
            
            <div className="form-group">
              <label>CVV</label>
              <input
                type="text"
                name="cvv"
                value={formData.cvv}
                onChange={handleChange}
                placeholder="123"
                required
              />
              {errors.cvv && <span className="error">{errors.cvv}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label>Transaction Simulation</label>
            <select
              name="transactionType"
              value={formData.transactionType}
              onChange={handleChange}
            >
              <option value="1">Approved Transaction</option>
              <option value="2">Declined Transaction</option>
              <option value="3">Gateway Error/Failure</option>
            </select>
          </div>
          
          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Processing...' : 'Place Order'}
          </button>
        </form>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="summary-item">
            <span>Product:</span>
            <span>{product.name} ({product.variant})</span>
          </div>
          <div className="summary-item">
            <span>Quantity:</span>
            <span>{product.quantity}</span>
          </div>
          <div className="summary-item">
            <span>Price per item:</span>
            <span>${product.price.toFixed(2)}</span>
          </div>
          <div className="summary-item total">
            <span>Total:</span>
            <span>${(product.price * product.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;