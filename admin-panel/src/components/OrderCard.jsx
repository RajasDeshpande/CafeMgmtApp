import { orderAPI } from '../services/api';
import toast from 'react-hot-toast';
import { IoTimeOutline, IoFlameOutline, IoCheckmarkCircle, IoRestaurantOutline } from 'react-icons/io5';

const STATUS_CONFIG = {
  Pending: { color: '#f59e0b', icon: IoTimeOutline, next: 'Preparing' },
  Preparing: { color: '#ef4444', icon: IoFlameOutline, next: 'Served' },
  Served: { color: '#22c55e', icon: IoRestaurantOutline, next: 'Completed' },
  Completed: { color: '#d4af37', icon: IoCheckmarkCircle, next: null },
};

export default function OrderCard({ order, onUpdate, onBill }) {
  const config = STATUS_CONFIG[order.status];
  const StatusIcon = config.icon;

  const handleStatusChange = async () => {
    if (!config.next) return;
    try {
      await orderAPI.updateStatus(order._id, config.next);
      onUpdate();
      toast.success(`Order #${order.orderNumber} → ${config.next}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const timeAgo = () => {
    const diff = Date.now() - new Date(order.createdAt).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
  };

  return (
    <div className="order-card" style={{ borderLeftColor: config.color }}>
      <div className="order-card-header">
        <div>
          <span className="order-number">#{order.orderNumber}</span>
          <span className="order-table">Table {order.tableNumber}</span>
        </div>
        <div className="order-status-badge" style={{ background: config.color + '22', color: config.color }}>
          <StatusIcon /> {order.status}
        </div>
      </div>
      <div className="order-card-customer">
        <span>{order.customerName}</span>
        <span className="order-time">{timeAgo()}</span>
      </div>
      <div className="order-card-items">
        {order.items.map((item, idx) => (
          <div key={idx} className="order-card-item">
            <span>{item.quantity}x {item.name}</span>
            {item.specialInstructions && <small>📝 {item.specialInstructions}</small>}
          </div>
        ))}
      </div>
      <div className="order-card-footer">
        <span className="order-card-total">₹{order.totalPrice}</span>
        <div className="order-card-actions">
          {config.next && (
            <button className="btn-status" style={{ background: config.color }} onClick={handleStatusChange}>
              Move to {config.next}
            </button>
          )}
          {(order.status === 'Served' || order.status === 'Completed') && (
            <button className="btn-bill" onClick={() => onBill(order._id)}>
              📋 Bill
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
