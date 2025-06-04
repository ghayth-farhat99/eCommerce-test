import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleBuyNow = () => {
    const productSelection = {
      ...product,
      variant: selectedVariant,
      quantity
    };
    navigate('/checkout', { state: { product: productSelection } });
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} className="product-image" />
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      
      <div className="variant-selector">
        <label>Variant:</label>
        <select 
          value={selectedVariant} 
          onChange={(e) => setSelectedVariant(e.target.value)}
        >
          {product.variants.map(variant => (
            <option key={variant} value={variant}>{variant}</option>
          ))}
        </select>
      </div>
      
      <div className="quantity-selector">
        <label>Quantity:</label>
        <input 
          type="number" 
          min="1" 
          max="10" 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        />
      </div>
      
      <button onClick={handleBuyNow} className="buy-now-btn">Buy Now</button>
    </div>
  );
};

export default ProductCard;