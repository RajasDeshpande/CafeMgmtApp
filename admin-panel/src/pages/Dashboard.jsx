import { useState, useEffect, useCallback } from 'react';
import { orderAPI, analyticsAPI } from '../services/api';
import { useSocket } from '../context/SocketContext';
import OrderCard from '../components/OrderCard';
import StatsCard from '../components/StatsCard';
import BillModal from '../components/BillModal';
import toast from 'react-hot-toast';
import { IoCashOutline, IoReceiptOutline, IoTimeOutline, IoFlameOutline } from 'react-icons/io5';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [billOrderId, setBillOrderId] = useState(null);
  const [filter, setFilter] = useState('active');
  const socket = useSocket();

  const fetchData = useCallback(async () => {
    try {
      const [ordersRes, statsRes] = await Promise.all([
        orderAPI.getToday(),
        analyticsAPI.getRevenue(),
      ]);
      setOrders(ordersRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (!socket) return;
    const handleNewOrder = (order) => {
      toast('🔔 New Order #' + order.orderNumber, {
        style: { background: '#1a1a2e', color: '#f0ead6', border: '1px solid rgba(212,175,55,0.3)' },
        duration: 5000,
      });
      fetchData();
    };
    const handleStatusUpdate = () => fetchData();

    socket.on('new-order', handleNewOrder);
    socket.on('order-status-update', handleStatusUpdate);
    return () => {
      socket.off('new-order', handleNewOrder);
      socket.off('order-status-update', handleStatusUpdate);
    };
  }, [socket, fetchData]);

  const filteredOrders = orders.filter(o => {
    if (filter === 'active') return ['Pending', 'Preparing', 'Served'].includes(o.status);
    return o.status === filter;
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <span className="dashboard-date">{new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
      </div>

      {/* Stats */}
      {stats && (
        <div className="stats-grid">
          <StatsCard title="Today's Revenue" value={`₹${stats.totalRevenue}`} icon={IoCashOutline} color="#d4af37" />
          <StatsCard title="Total Orders" value={stats.totalOrders} icon={IoReceiptOutline} color="#8b5cf6" />
          <StatsCard title="Pending" value={stats.pendingOrders} icon={IoTimeOutline} color="#f59e0b" />
          <StatsCard title="Preparing" value={stats.preparingOrders} icon={IoFlameOutline} color="#ef4444" />
        </div>
      )}

      {/* Order Filter */}
      <div className="order-filter-bar">
        {['active', 'Pending', 'Preparing', 'Served', 'Completed'].map(f => (
          <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}>
            {f === 'active' ? 'Active' : f}
            {f === 'active' && <span className="filter-count">{orders.filter(o => ['Pending', 'Preparing', 'Served'].includes(o.status)).length}</span>}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      <div className="orders-grid">
        {filteredOrders.length === 0 ? (
          <div className="empty-orders"><p>No {filter} orders right now</p></div>
        ) : (
          filteredOrders.map(order => (
            <OrderCard key={order._id} order={order} onUpdate={fetchData} onBill={setBillOrderId} />
          ))
        )}
      </div>

      {/* Bill Modal */}
      <BillModal orderId={billOrderId} onClose={() => setBillOrderId(null)} />
    </div>
  );
}
