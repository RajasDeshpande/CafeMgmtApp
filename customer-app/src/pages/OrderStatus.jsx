import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { io } from 'socket.io-client';
import { IoCheckmarkCircle, IoTimeOutline, IoFlameOutline, IoRestaurantOutline } from 'react-icons/io5';

const STATUS_STEPS = [
  { key: 'Pending', label: 'Order Received', icon: IoTimeOutline, color: '#f59e0b' },
  { key: 'Preparing', label: 'Preparing', icon: IoFlameOutline, color: '#ef4444' },
  { key: 'Served', label: 'Served', icon: IoRestaurantOutline, color: '#22c55e' },
  { key: 'Completed', label: 'Completed', icon: IoCheckmarkCircle, color: '#d4af37' },
];

export default function OrderStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await orderAPI.getById(id);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to fetch order:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();

    // Connect to socket for real-time updates
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
    });
    socket.emit('join-order', id);
    socket.on('order-status-update', (updatedOrder) => {
      if (updatedOrder._id === id) setOrder(updatedOrder);
    });

    return () => {
      socket.emit('leave-order', id);
      socket.disconnect();
    };
  }, [id]);

  if (loading) {
    return <div className="loading-screen"><div className="loader"></div><p>Loading order...</p></div>;
  }
  if (!order) {
    return <div className="empty-state"><h2>Order not found</h2><button className="btn-primary" onClick={() => navigate('/')}>Go to Menu</button></div>;
  }

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="order-status-page">
      <div className="order-header">
        <h1>Order #{order.orderNumber}</h1>
        <p className="order-meta">Table {order.tableNumber} · {order.customerName}</p>
      </div>

      {/* Status Tracker */}
      <div className="status-tracker">
        {STATUS_STEPS.map((step, idx) => {
          const StepIcon = step.icon;
          const isActive = idx <= currentStepIndex;
          return (
            <div key={step.key} className={`status-step ${isActive ? 'active' : ''}`}>
              <div className="step-icon" style={{ borderColor: isActive ? step.color : '#333', color: isActive ? step.color : '#666' }}>
                <StepIcon />
              </div>
              <span className="step-label" style={{ color: isActive ? '#fff' : '#666' }}>{step.label}</span>
              {idx < STATUS_STEPS.length - 1 && (
                <div className="step-connector" style={{ background: isActive ? step.color : '#333' }}></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Order Items */}
      <div className="order-items-list">
        <h2>Order Details</h2>
        {order.items.map((item, idx) => (
          <div key={idx} className="order-item-row">
            <span className="item-qty">{item.quantity}x</span>
            <span className="item-name">{item.name}</span>
            {item.specialInstructions && <span className="item-note">📝 {item.specialInstructions}</span>}
            <span className="item-price">₹{item.price * item.quantity}</span>
          </div>
        ))}
        <div className="order-total-row">
          <span>Total</span>
          <span>₹{order.totalPrice}</span>
        </div>
      </div>

      <button className="btn-primary" onClick={() => navigate('/')}>Order More</button>
    </div>
  );
}
