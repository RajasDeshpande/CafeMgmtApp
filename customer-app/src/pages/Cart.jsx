import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { IoTrashOutline, IoAddOutline, IoRemoveOutline, IoCartOutline } from 'react-icons/io5';

export default function Cart() {
  const { items, removeItem, updateQuantity, updateInstructions, clearCart, totalPrice } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!customerName.trim()) return toast.error('Please enter your name');
    if (!tableNumber || tableNumber < 1) return toast.error('Please enter a valid table number');

    setLoading(true);
    try {
      const orderData = {
        items: items.map(i => ({
          menuItemId: i._id,
          quantity: i.quantity,
          specialInstructions: i.specialInstructions,
        })),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        tableNumber: parseInt(tableNumber),
      };

      const res = await orderAPI.place(orderData);
      clearCart();
      toast.success('Order placed successfully!', {
        icon: '🎉',
        style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' },
      });
      navigate(`/order/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <IoCartOutline className="empty-cart-icon" />
        <h2>Your cart is empty</h2>
        <p>Add some delicious items from our menu!</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Browse Menu</button>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">Your Order</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {items.map(item => (
            <div key={item._id} className="cart-item">
              <img src={item.image} alt={item.name} className="cart-item-img" />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p className="cart-item-price">₹{item.price} each</p>
                <div className="quantity-controls">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)} className="qty-btn">
                    <IoRemoveOutline />
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)} className="qty-btn">
                    <IoAddOutline />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="Special instructions (e.g., extra sugar)"
                  value={item.specialInstructions}
                  onChange={e => updateInstructions(item._id, e.target.value)}
                  className="instructions-input"
                />
              </div>
              <div className="cart-item-actions">
                <span className="cart-item-total">₹{item.price * item.quantity}</span>
                <button onClick={() => removeItem(item._id)} className="remove-btn">
                  <IoTrashOutline />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="checkout-panel">
          <h2>Checkout</h2>
          <div className="checkout-form">
            <div className="form-group">
              <label htmlFor="customer-name">Your Name *</label>
              <input id="customer-name" type="text" value={customerName}
                onChange={e => setCustomerName(e.target.value)} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label htmlFor="customer-phone">Phone (for bill via WhatsApp)</label>
              <input id="customer-phone" type="tel" value={customerPhone}
                onChange={e => setCustomerPhone(e.target.value)} placeholder="+91 9876543210" />
            </div>
            <div className="form-group">
              <label htmlFor="table-number">Table Number *</label>
              <input id="table-number" type="number" min="1" value={tableNumber}
                onChange={e => setTableNumber(e.target.value)} placeholder="1" />
            </div>
          </div>
          <div className="order-summary">
            <div className="summary-row">
              <span>Items ({items.reduce((s, i) => s + i.quantity, 0)})</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
          <button className="btn-checkout" onClick={handleCheckout} disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order — ₹${totalPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
}
