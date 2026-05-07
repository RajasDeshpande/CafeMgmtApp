import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';
import BillModal from '../components/BillModal';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [billOrderId, setBillOrderId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = {};
        if (statusFilter) params.status = statusFilter;
        const res = await orderAPI.getAll(params);
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      }
    };
    fetchOrders();
  }, [statusFilter]);

  return (
    <div className="order-history">
      <div className="page-header">
        <h1>Order History</h1>
        <select className="status-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Served">Served</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="history-table-wrap">
        <table className="history-table">
          <thead>
            <tr><th>#</th><th>Customer</th><th>Table</th><th>Items</th><th>Total</th><th>Status</th><th>Time</th><th></th></tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="order-num">{order.orderNumber}</td>
                <td>{order.customerName}</td>
                <td>{order.tableNumber}</td>
                <td>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                <td className="price-cell">₹{order.totalPrice}</td>
                <td><span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                <td className="time-cell">{new Date(order.createdAt).toLocaleString('en-IN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}</td>
                <td><button className="btn-icon" onClick={() => setBillOrderId(order._id)}>📋</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <div className="empty-orders"><p>No orders found</p></div>}
      </div>

      <BillModal orderId={billOrderId} onClose={() => setBillOrderId(null)} />
    </div>
  );
}
